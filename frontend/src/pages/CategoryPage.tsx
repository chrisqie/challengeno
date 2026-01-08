import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GameTemplate } from '../types/template';
import { templatesAPI } from '../services/api';
import { MAIN_CATEGORIES, getCategoryById, getSubcategoryById } from '../config/categories';
import { getCategoryName, getCategoryDescription, getSubcategoryName, getSubcategoryDescription } from '../utils/categoryTranslation';
import Breadcrumb from '../components/Breadcrumb';
import TemplateCard from '../components/TemplateCard';

export const CategoryPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId?: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = getCategoryById(categoryId || '');
  const subcategory = subcategoryId ? getSubcategoryById(subcategoryId) : null;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: any = {};
        if (categoryId) {
          filters.category = categoryId;
        }
        if (subcategoryId) {
          filters.subcategory = subcategoryId;
        }
        filters.language = i18n.language;

        const response = await templatesAPI.getTemplates(filters);
        setTemplates(response.data);
      } catch (err) {
        console.error('获取模板失败:', err);
        setError(t('categoryPage.error.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [categoryId, subcategoryId, i18n.language]);

  const getBreadcrumbItems = () => {
    const items = [];

    if (category) {
      items.push({
        label: getCategoryName(category.id),
        icon: category.icon,
        onClick: () => navigate(`/category/${category.id}`)
      });
    }

    if (subcategory) {
      items.push({
        label: getSubcategoryName(subcategory.id),
        icon: subcategory.icon
      });
    }

    return items;
  };

  const handleTemplateClick = (template: GameTemplate) => {
    navigate(`/game/${template.id}`);
  };

  const handleSubcategoryClick = (subId: string) => {
    navigate(`/category/${categoryId}/${subId}`);
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('categoryPage.error.notFound')}</h1>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            {t('categoryPage.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbItems()} className="mb-6" />

      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-3">{subcategory?.icon || category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {subcategory ? getSubcategoryName(subcategory.id) : getCategoryName(category.id)}
            </h1>
            <p className="text-gray-600 mt-1">
              {subcategory ? getSubcategoryDescription(subcategory.id) : getCategoryDescription(category.id)}
            </p>
          </div>
        </div>
      </div>

      {/* 如果是主分类页面，显示子分类 */}
      {!subcategoryId && category.subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('categoryPage.subcategories')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.subcategories.map((sub) => (
              <div
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub.id)}
                className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{sub.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{getSubcategoryName(sub.id)}</h3>
                </div>
                <p className="text-gray-600 text-sm">{getSubcategoryDescription(sub.id)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 模板列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {subcategory ? t('categoryPage.relatedTemplates') : t('categoryPage.allTemplates')}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              {t('categoryPage.retry')}
            </button>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{t('categoryPage.noTemplates')}</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              {t('categoryPage.browseAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleTemplateClick(template)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
