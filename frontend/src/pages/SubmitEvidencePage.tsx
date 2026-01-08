import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { gamesAPI } from '../services/api'
import { ArrowLeft, Camera, FileText, Upload } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface EvidenceForm {
  evidenceType: 'PHOTO' | 'TEXT'
  evidenceContent: string
  evidenceDescription?: string
  selfReportedSuccess?: string | boolean
}

const SubmitEvidencePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data: game, isLoading } = useQuery(
    ['game', id],
    () => gamesAPI.getGame(id!),
    {
      select: (response) => response.data,
      enabled: !!id,
    }
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvidenceForm>({
    defaultValues: {
      evidenceType: game?.evidenceType || 'PHOTO',
      selfReportedSuccess: undefined,
    },
  })

  const evidenceType = watch('evidenceType')

  const submitMutation = useMutation(
    (data: EvidenceForm) => gamesAPI.submitEvidence(id!, data),
    {
      onSuccess: () => {
        toast.success('证据提交成功！')
        queryClient.invalidateQueries(['game', id])
        navigate(`/game/${id}`)
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || '提交失败'
        toast.error(message)
      },
    }
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // 创建预览URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // 将文件转换为base64字符串存储
      const reader = new FileReader()
      reader.onload = (e) => {
        setValue('evidenceContent', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: EvidenceForm) => {
    if (evidenceType === 'PHOTO' && !data.evidenceContent) {
      toast.error('请选择要上传的照片')
      return
    }

    if (evidenceType === 'TEXT' && !data.evidenceContent.trim()) {
      toast.error('请输入证据描述')
      return
    }

    if (data.selfReportedSuccess === undefined) {
      toast.error('请选择您的自我评价')
      return
    }

    // 转换字符串值为布尔值
    const submitData = {
      ...data,
      selfReportedSuccess: typeof data.selfReportedSuccess === 'string'
        ? data.selfReportedSuccess === 'true'
        : data.selfReportedSuccess
    }

    submitMutation.mutate(submitData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">挑战不存在</h3>
        <button onClick={() => navigate('/')} className="btn-primary">
          返回首页
        </button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/game/${id}`)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">提交证据</h1>
        <div></div>
      </div>

      {/* 挑战信息 */}
      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">{game.title}</h2>
        <p className="text-sm text-gray-600 mb-3">{game.description}</p>
        <div className="text-xs text-gray-500">
          <p>证据提交截止: {formatDate(game.evidenceDeadline)}</p>
          <p className="mt-1">证据要求: {game.evidenceInstructions}</p>
        </div>
      </div>

      {/* 证据提交表单 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 证据类型 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">证据类型</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                {...register('evidenceType')}
                type="radio"
                value="PHOTO"
                className="text-primary-600"
              />
              <Camera className="w-5 h-5" />
              <span>照片/视频</span>
            </label>
            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                {...register('evidenceType')}
                type="radio"
                value="TEXT"
                className="text-primary-600"
              />
              <FileText className="w-5 h-5" />
              <span>文字描述</span>
            </label>
          </div>
        </div>

        {/* 证据内容 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">证据内容</h3>
          
          {evidenceType === 'PHOTO' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="预览"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setValue('evidenceContent', '')
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      重新选择
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <label className="btn-primary cursor-pointer">
                        选择照片
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      支持 JPG、PNG 格式，最大 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <textarea
                {...register('evidenceContent', {
                  required: '请输入证据描述',
                  minLength: { value: 10, message: '证据描述至少10个字符' },
                })}
                rows={6}
                className="input"
                placeholder="请详细描述您完成挑战的情况..."
              />
              {errors.evidenceContent && (
                <p className="mt-1 text-sm text-red-600">{errors.evidenceContent.message}</p>
              )}
            </div>
          )}
        </div>

        {/* 补充说明 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">补充说明（可选）</h3>
          <textarea
            {...register('evidenceDescription')}
            rows={3}
            className="input"
            placeholder="您可以在这里添加更多说明..."
          />
        </div>

        {/* 自我评价 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">自我评价</h3>
          <p className="text-gray-600 mb-4">请诚实评价您是否成功完成了这个挑战：</p>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('selfReportedSuccess')}
                type="radio"
                value="true"
                className="w-4 h-4 text-green-600"
              />
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-gray-700 font-medium">成功完成</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('selfReportedSuccess')}
                type="radio"
                value="false"
                className="w-4 h-4 text-red-600"
              />
              <div className="flex items-center space-x-2">
                <span className="text-red-600">❌</span>
                <span className="text-gray-700 font-medium">未能完成</span>
              </div>
            </label>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={submitMutation.isLoading}
          className="w-full btn-primary py-3 text-lg"
        >
          {submitMutation.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>提交中...</span>
            </div>
          ) : (
            '提交证据'
          )}
        </button>
      </form>
    </div>
  )
}

export default SubmitEvidencePage
