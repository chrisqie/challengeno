import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { templatesAPI } from '../services/api';
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, Wrench, User, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TemplateDiagnosePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // 诊断模板
  const diagnoseMutation = useMutation(
    () => templatesAPI.diagnoseTemplates(),
    {
      onSuccess: (response) => {
        console.log('诊断响应完整对象:', response);
        console.log('响应数据:', response.data);
        console.log('响应状态:', response.status);

        // 处理响应数据
        const result = response.data;
        setDiagnosticResult(result);

        if (result && result.success) {
          toast.success('模板诊断完成');
        } else {
          const errorMsg = result?.message || result?.error || '诊断返回未知错误';
          toast.error('模板诊断失败: ' + errorMsg);
        }
      },
      onError: (error: any) => {
        console.error('诊断错误完整对象:', error);
        console.error('错误响应:', error.response);
        console.error('错误状态:', error.response?.status);
        console.error('错误数据:', error.response?.data);

        let errorMessage = '未知错误';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error('诊断请求失败: ' + errorMessage);

        // 设置错误结果
        setDiagnosticResult({
          success: false,
          error: errorMessage,
          message: '请求失败: ' + errorMessage
        });
      }
    }
  );

  // 快速修复模板
  const fixMutation = useMutation(
    () => templatesAPI.quickFixTemplates(),
    {
      onSuccess: (response) => {
        console.log('修复响应:', response);
        if (response.data.success) {
          toast.success(response.data.message);
          // 重新诊断
          setTimeout(() => {
            diagnoseMutation.mutate();
          }, 1000);
        } else {
          toast.error(response.data.message);
        }
      },
      onError: (error: any) => {
        console.error('修复错误:', error);
        const errorMessage = error.response?.data?.message || error.message || '未知错误';
        toast.error('修复失败: ' + errorMessage);
      }
    }
  );

  // 获取模板列表
  const { data: templatesData, refetch: refetchTemplates } = useQuery(
    'templates-for-diagnosis',
    () => templatesAPI.getTemplates({ language: 'en' }),
    {
      select: (response) => response.data,
      enabled: false // 手动触发
    }
  );

  const handleDiagnose = () => {
    diagnoseMutation.mutate();
    refetchTemplates();
  };

  const handleQuickFix = () => {
    if (confirm('确定要执行快速修复吗？这将重新初始化所有模板。')) {
      fixMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">模板诊断工具</h1>
              <p className="text-gray-600">检查和修复游戏模板问题</p>
              <div className="flex items-center space-x-2 mt-2">
                {user ? (
                  <>
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">已登录: {user.username}</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">未登录 (诊断功能仍可用)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">诊断操作</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleDiagnose}
              disabled={diagnoseMutation.isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              {diagnoseMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>开始诊断</span>
            </button>

            <button
              onClick={handleQuickFix}
              disabled={fixMutation.isLoading}
              className="btn-secondary flex items-center space-x-2"
            >
              {fixMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Wrench className="w-4 h-4" />
              )}
              <span>快速修复</span>
            </button>
          </div>
        </div>

        {/* 诊断结果 */}
        {diagnosticResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              {diagnosticResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              <span>诊断结果</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">模板数量</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {diagnosticResult.templateCount}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">状态</div>
                  <div className={`text-lg font-semibold ${
                    diagnosticResult.hasTemplates ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {diagnosticResult.hasTemplates ? '正常' : '异常'}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">消息</div>
                <div className="text-gray-900">{diagnosticResult.message}</div>
              </div>

              {diagnosticResult.sampleTemplates && diagnosticResult.sampleTemplates.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">示例模板</div>
                  <div className="space-y-2">
                    {diagnosticResult.sampleTemplates.map((template: any) => (
                      <div key={template.id} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium">{template.title}</div>
                        <div className="text-sm text-gray-600">
                          ID: {template.id} | 分类: {template.category} | 
                          状态: {template.isActive ? '活跃' : '停用'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diagnosticResult.error && (
                <div>
                  <div className="text-sm font-medium text-red-700 mb-2">错误信息</div>
                  <div className="text-red-600 bg-red-50 p-3 rounded">
                    {diagnosticResult.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 模板列表 */}
        {templatesData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">当前模板列表</h2>
            {templatesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>没有找到任何模板</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templatesData.slice(0, 10).map((template: any) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>🏷️ {template.category}</span>
                      <span>👥 {template.maxParticipants}人</span>
                      {template.isVipOnly && <span>👑 VIP</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {templatesData.length > 10 && (
              <div className="mt-4 text-center text-gray-500">
                还有 {templatesData.length - 10} 个模板未显示...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateDiagnosePage;
