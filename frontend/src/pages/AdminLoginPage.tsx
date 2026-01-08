import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface AdminLoginForm {
  username: string;
  password: string;
}

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>();

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      // 先登录获取token
      const loginResponse = await authAPI.login(data.username, data.password);
      const { accessToken } = loginResponse.data;

      // 临时设置token到store，以便后续API调用能使用
      setAuth(accessToken, null as any);

      // 使用token获取用户详细信息
      const profileResponse = await authAPI.getProfile();
      const user = profileResponse.data;

      console.log('Profile response:', user);
      console.log('isAdmin:', user.isAdmin);
      console.log('adminRole:', user.adminRole);

      // Check if user is admin
      if (!user.isAdmin) {
        toast.error('You do not have administrator privileges');
        // Clear possible authentication state
        useAuthStore.getState().logout();
        return;
      }

      // Set authentication state
      setAuth(accessToken, user);
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-purple-200">ChallengeNo System Management</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Admin Account
              </label>
              <input
                {...register('username', { required: 'Please enter admin account' })}
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter admin username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-300">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Please enter password' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Login to Admin Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-purple-200 hover:text-white text-sm transition-colors"
            >
              Back to User Portal
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-purple-200 text-sm">
          <p>System Administrators Only</p>
          <p className="mt-1">Contact system administrator for assistance</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
