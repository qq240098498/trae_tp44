import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import type { JobDescriptionForm, JobPosition } from '../../shared/types';
import { useAppStore } from '../store';
import { api } from '../utils/api';
import { copyToClipboard, downloadFile } from '../utils/helpers';

const departments = [
  '技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部', '销售部', '客服部', '法务部'
];

const levels = [
  { value: 'entry', label: '应届生' },
  { value: 'junior', label: '初级' },
  { value: 'mid', label: '中级' },
  { value: 'senior', label: '高级' },
  { value: 'lead', label: '技术专家' },
  { value: 'manager', label: '技术经理' },
];

export default function JobDescription() {
  const { setCurrentJobPosition, setLoading, loading } = useAppStore();
  const [generatedJob, setGeneratedJob] = useState<(JobPosition & { biasValidation?: { isValid: boolean; warnings: string[] } }) | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'form' | 'preview'>('form');

  const { register, handleSubmit, formState: { errors } } = useForm<JobDescriptionForm>({
    defaultValues: {
      title: '',
      department: '技术部',
      level: 'mid',
      industry: '互联网',
      responsibilities: '',
      requirements: '',
      skills: '',
    },
  });

  const onSubmit = async (data: JobDescriptionForm) => {
    setLoading(true);
    try {
      const result = await api.jobDescription.generate(data);
      setGeneratedJob(result);
      setCurrentJobPosition(result);
      setStep('preview');
    } catch (error) {
      console.error('生成职位描述失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedJob?.generatedDescription) {
      await copyToClipboard(generatedJob.generatedDescription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedJob?.generatedDescription) {
      downloadFile(
        generatedJob.generatedDescription,
        `${generatedJob.title}-职位描述.md`,
        'text/markdown'
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-primary-900">
              职位描述生成
            </h1>
            <p className="text-slate-500">快速生成专业、规范的职位描述，自动检测歧视性用语</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setStep('form')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            step === 'form'
              ? 'bg-primary-900 text-white shadow-lg'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          填写信息
        </button>
        <button
          onClick={() => generatedJob && setStep('preview')}
          disabled={!generatedJob}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            step === 'preview'
              ? 'bg-primary-900 text-white shadow-lg'
              : 'bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          预览结果
        </button>
      </div>

      {step === 'form' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    职位名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: '请输入职位名称' })}
                    className="input-field"
                    placeholder="如：高级前端工程师"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    所属部门 <span className="text-red-500">*</span>
                  </label>
                  <select {...register('department')} className="input-field">
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    职级要求 <span className="text-red-500">*</span>
                  </label>
                  <select {...register('level')} className="input-field">
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    所属行业
                  </label>
                  <input
                    type="text"
                    {...register('industry')}
                    className="input-field"
                    placeholder="如：互联网、金融、教育"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  核心职责
                </label>
                <textarea
                  {...register('responsibilities')}
                  className="input-field min-h-[120px]"
                  placeholder="每行输入一项职责，如：&#10;负责产品前端架构设计&#10;带领团队完成项目交付"
                  rows={4}
                />
                <p className="mt-1 text-xs text-slate-500">
                  可选，系统会根据部门自动补充标准职责
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  任职要求
                </label>
                <textarea
                  {...register('requirements')}
                  className="input-field min-h-[120px]"
                  placeholder="每行输入一项要求，如：&#10;5年以上前端开发经验&#10;精通 React 框架"
                  rows={4}
                />
                <p className="mt-1 text-xs text-slate-500">
                  可选，系统会根据职级自动补充标准要求
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  技能要求
                </label>
                <input
                  type="text"
                  {...register('skills')}
                  className="input-field"
                  placeholder="用逗号分隔，如：React, TypeScript, Vue, Node.js"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    团队规模
                  </label>
                  <input
                    type="text"
                    {...register('teamSize')}
                    className="input-field"
                    placeholder="如：10-15人"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    工作地点
                  </label>
                  <input
                    type="text"
                    {...register('location')}
                    className="input-field"
                    placeholder="如：北京"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    薪资范围
                  </label>
                  <input
                    type="text"
                    {...register('salaryRange')}
                    className="input-field"
                    placeholder="如：30K-50K"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                {loading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Sparkles size={20} />
                )}
                {loading ? '生成中...' : '智能生成职位描述'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="card p-6 bg-gradient-to-br from-primary-900/5 to-blue-50">
              <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                <Eye size={18} />
                公平性检测
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                系统将自动检测职位描述中是否包含性别、年龄、地域等歧视性用语，确保招聘公平。
              </p>
              <div className="space-y-3">
                {['性别', '年龄', '地域', '婚姻状况', '宗教信仰'].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-slate-600">已启用 {item} 检测</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-primary-900 mb-4">填写提示</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-accent-blue">•</span>
                  职位名称尽量具体，避免使用模糊的称呼
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-blue">•</span>
                  核心职责描述候选人将承担的具体工作
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-blue">•</span>
                  任职要求区分必备条件和加分项
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-blue">•</span>
                  技能要求列出与工作相关的技术栈
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-blue">•</span>
                  避免使用可能涉及歧视的描述性词语
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-8">
              {generatedJob?.biasValidation && generatedJob.biasValidation.warnings.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex gap-3">
                    <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">公平性警告</h4>
                      <ul className="space-y-1 text-sm text-amber-700">
                        {generatedJob.biasValidation.warnings.map((warning, i) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-primary-900">
                  {generatedJob?.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Download size={16} />
                    下载
                  </button>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {generatedJob?.generatedDescription}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-primary-900 mb-4">生成信息</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">部门</span>
                  <span className="font-medium text-primary-900">{generatedJob?.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">职级</span>
                  <span className="font-medium text-primary-900">{levels.find(l => l.value === generatedJob?.level)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">职责数量</span>
                  <span className="font-medium text-primary-900">{generatedJob?.responsibilities.length} 项</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">要求数量</span>
                  <span className="font-medium text-primary-900">{generatedJob?.requirements.length} 项</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">技能数量</span>
                  <span className="font-medium text-primary-900">{generatedJob?.skills.length} 项</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">公平性检测</span>
                  <span className={`font-medium ${generatedJob?.biasValidation?.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {generatedJob?.biasValidation?.isValid ? '通过' : '有警告'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <h3 className="font-bold text-emerald-900">已包含平等机会声明</h3>
              </div>
              <p className="text-sm text-emerald-800">
                职位描述末尾已自动添加平等机会声明，展示公司的包容性文化。
              </p>
            </div>

            <button
              onClick={() => setStep('form')}
              className="btn-secondary w-full"
            >
              重新生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
