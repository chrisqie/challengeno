import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { gamesAPI } from '../services/api'
import { ArrowLeft, CheckCircle, XCircle, User } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from 'react-i18next'

interface Participant {
  id: string
  userId: string
  evidenceSubmitted: boolean
  evidenceType: string
  evidenceContent: string
  selfReportedSuccess: boolean
  user: {
    id: string
    username: string
    fullName: string
    trustPoints: number
  }
}

const PeerEvaluationPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [evaluations, setEvaluations] = useState<Record<string, { evaluation: string, reasoning: string }>>({})
  const [submittedEvaluations, setSubmittedEvaluations] = useState<Set<string>>(new Set())

  const { data: game, isLoading: gameLoading } = useQuery(
    ['game', id],
    () => gamesAPI.getGame(id!),
    {
      select: (response) => response.data,
      enabled: !!id,
    }
  )

  const { data: participants, isLoading: participantsLoading } = useQuery(
    ['game-participants', id],
    () => gamesAPI.getGameParticipants(id!),
    {
      select: (response) => {
        console.log('Participants data:', response.data);
        response.data?.forEach((p: any) => {
          console.log(`Participant ${p.user?.username}:`, {
            selfReportedSuccess: p.selfReportedSuccess,
            type: typeof p.selfReportedSuccess,
            value: p.selfReportedSuccess
          });
        });
        return response.data;
      },
      enabled: !!id,
    }
  )

  const { data: myEvaluations } = useQuery(
    ['my-evaluations', id],
    () => gamesAPI.getMyEvaluations(id!),
    {
      select: (response) => response.data,
      enabled: !!id,
      onSuccess: (evaluations) => {
        const evaluatedUserIds = evaluations.map((evaluation: any) => evaluation.evaluatedId)
        setSubmittedEvaluations(new Set(evaluatedUserIds))

        const newEvaluations: Record<string, { evaluation: string, reasoning: string }> = {}
        evaluations.forEach((evaluation: any) => {
          newEvaluations[evaluation.evaluatedId] = {
            evaluation: evaluation.evaluation === 'RECOGNIZE' ? t('peerEvaluation.recognize') : t('peerEvaluation.notRecognize'),
            reasoning: evaluation.reasoning || ''
          }
        })
        setEvaluations(prev => ({ ...prev, ...newEvaluations }))
      }
    }
  )

  const submitMutation = useMutation(
    (data: { evaluatedUserId: string, evaluation: string, reasoning?: string }) =>
      gamesAPI.submitPeerEvaluation(id!, data),
    {
      onSuccess: (_, variables) => {
        toast.success(t('peerEvaluation.submitSuccess'))
        setSubmittedEvaluations(prev => new Set([...prev, variables.evaluatedUserId]))
        queryClient.invalidateQueries(['game', id])
        queryClient.invalidateQueries(['game-participants', id])
        queryClient.invalidateQueries(['my-evaluations', id])
      },
      onError: (error: any, variables) => {
        const message = error.response?.data?.message || t('peerEvaluation.submitFailed')
        toast.error(message)

        if (message.includes('已经评价过') || message.includes('already evaluated')) {
          setSubmittedEvaluations(prev => new Set([...prev, variables.evaluatedUserId]))
        }
      },
    }
  )

  const handleEvaluationChange = (userId: string, field: 'evaluation' | 'reasoning', value: string) => {
    setEvaluations(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      }
    }))
  }

  const handleSubmitEvaluation = (userId: string) => {
    const evaluation = evaluations[userId]
    if (!evaluation?.evaluation) {
      toast.error(t('peerEvaluation.selectEvaluation'))
      return
    }

    const backendEvaluation = evaluation.evaluation === t('peerEvaluation.recognize') ? 'RECOGNIZE' : 'NOT_RECOGNIZE'

    const participant = otherParticipants.find((p: Participant) => p.userId === userId)
    if (!participant) {
      toast.error(t('peerEvaluation.participantError'))
      return
    }

    console.log('Submitting evaluation for participant:', {
      participantUserId: participant.userId,
      userIdFromUser: participant.user.id,
      participantUserIdType: typeof participant.userId,
      userIdFromUserType: typeof participant.user.id,
      participantUserIdLength: participant.userId?.length,
      userIdFromUserLength: participant.user.id?.length
    })

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const isValidUUID = uuidRegex.test(participant.user.id)
    console.log('UUID validation:', {
      evaluatedUserId: participant.user.id,
      isValidUUID
    })

    submitMutation.mutate({
      evaluatedUserId: participant.user.id,
      evaluation: backendEvaluation,
      reasoning: evaluation.reasoning,
    })
  }

  const renderEvidenceContent = (participant: Participant) => {
    if (!participant.evidenceSubmitted) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>{t('peerEvaluation.noEvidence')}</p>
        </div>
      )
    }

    const isUrl = participant.evidenceContent?.startsWith('http://') ||
                  participant.evidenceContent?.startsWith('https://');

    if (participant.evidenceType === 'PHOTO' && isUrl) {
      return (
        <div className="space-y-3">
          <img
            src={participant.evidenceContent}
            alt={t('peerEvaluation.evidencePhoto')}
            className="max-w-full max-h-96 rounded-lg mx-auto object-contain"
            onError={(e) => {
              console.error('Image load failed:', participant.evidenceContent);
              e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af"%3E${t('peerEvaluation.imageLoadFailed')}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>
      )
    } else if (participant.evidenceType === 'VIDEO' && isUrl) {
      return (
        <div className="space-y-3">
          <video
            src={participant.evidenceContent}
            controls
            className="max-w-full max-h-96 rounded-lg mx-auto"
            onError={(e) => {
              console.error('Video load failed:', participant.evidenceContent);
            }}
          >
            {t('peerEvaluation.videoNotSupported')}
          </video>
        </div>
      )
    } else {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-800 whitespace-pre-wrap">{participant.evidenceContent}</p>
        </div>
      )
    }
  }

  if (gameLoading || participantsLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!game || !participants) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('peerEvaluation.loadFailed')}</h3>
        <button onClick={() => navigate('/')} className="btn-primary">
          {t('peerEvaluation.backToHome')}
        </button>
      </div>
    )
  }

  const isSinglePlayerGame = participants.length === 1
  const otherParticipants = isSinglePlayerGame
    ? participants
    : participants.filter((p: Participant) => p.userId !== user?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/game/${id}`)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">
          {isSinglePlayerGame ? t('peerEvaluation.selfEvaluation') : t('peerEvaluation.title')}
        </h1>
        <div></div>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">{game.title}</h2>
        <p className="text-sm text-gray-600">{game.description}</p>
      </div>

      {isSinglePlayerGame && (
        <div className="card p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-blue-900 font-semibold mb-1">{t('peerEvaluation.singlePlayer.title')}</p>
              <p className="text-blue-800 text-sm">
                {t('peerEvaluation.singlePlayer.description')}
              </p>
              <p className="text-blue-700 text-xs mt-2">
                💡 {t('peerEvaluation.singlePlayer.tip')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {otherParticipants.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-2">{t('peerEvaluation.noParticipants')}</p>
            <p className="text-sm text-gray-400">
              {isSinglePlayerGame
                ? t('peerEvaluation.singlePlayer.needEvidence')
                : t('peerEvaluation.waitingEvidence')}
            </p>
          </div>
        ) : (
          otherParticipants.map((participant: Participant) => (
          <div key={participant.userId} className="card p-6">
            {/* 用户信息 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">@{participant.user.username}</h3>
                  <p className="text-sm text-gray-500">{t('peerEvaluation.trustPoints')}: {participant.user.trustPoints}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {participant.selfReportedSuccess ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('peerEvaluation.selfCompleted')}</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>{t('peerEvaluation.selfNotCompleted')}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">{t('peerEvaluation.submittedEvidence')}</h4>
              {renderEvidenceContent(participant)}
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{t('peerEvaluation.participantSelfEval')}:</span>
                {participant.selfReportedSuccess ? (
                  <span className="text-green-700 ml-2">✅ {t('peerEvaluation.believesCompleted')}</span>
                ) : (
                  <span className="text-red-700 ml-2">❌ {t('peerEvaluation.believesNotCompleted')}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('peerEvaluation.evaluationHint')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{t('peerEvaluation.yourEvaluation')}</h4>
                {submittedEvaluations.has(participant.user.id) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{t('peerEvaluation.submitted')}</span>
                  </span>
                )}
              </div>

              <div className={`grid grid-cols-2 gap-4 ${submittedEvaluations.has(participant.user.id) ? 'opacity-60 pointer-events-none' : ''}`}>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`evaluation-${participant.userId}`}
                    value={t('peerEvaluation.recognize')}
                    checked={evaluations[participant.userId]?.evaluation === t('peerEvaluation.recognize')}
                    onChange={(e) => handleEvaluationChange(participant.userId, 'evaluation', e.target.value)}
                    className="text-primary-600"
                    disabled={submittedEvaluations.has(participant.user.id)}
                  />
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">{t('peerEvaluation.recognize')}</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`evaluation-${participant.userId}`}
                    value={t('peerEvaluation.notRecognize')}
                    checked={evaluations[participant.userId]?.evaluation === t('peerEvaluation.notRecognize')}
                    onChange={(e) => handleEvaluationChange(participant.userId, 'evaluation', e.target.value)}
                    className="text-primary-600"
                    disabled={submittedEvaluations.has(participant.user.id)}
                  />
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{t('peerEvaluation.notRecognize')}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('peerEvaluation.reasoningLabel')}
                </label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder={t('peerEvaluation.reasoningPlaceholder')}
                  value={evaluations[participant.userId]?.reasoning || ''}
                  onChange={(e) => handleEvaluationChange(participant.userId, 'reasoning', e.target.value)}
                  disabled={submittedEvaluations.has(participant.user.id)}
                />
              </div>

              <button
                onClick={() => handleSubmitEvaluation(participant.userId)}
                disabled={
                  submitMutation.isLoading ||
                  !evaluations[participant.userId]?.evaluation ||
                  submittedEvaluations.has(participant.user.id)
                }
                className={`w-full ${
                  submittedEvaluations.has(participant.user.id)
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {submittedEvaluations.has(participant.user.id) ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('peerEvaluation.evaluationSubmitted')}</span>
                  </div>
                ) : submitMutation.isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>{t('peerEvaluation.submitting')}</span>
                  </div>
                ) : (
                  t('peerEvaluation.submitEvaluation')
                )}
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PeerEvaluationPage
