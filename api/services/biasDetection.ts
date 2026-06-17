import type { BiasCheckResult } from '../../shared/types';

const genderPatterns = [
  /\b(男|女|先生|女士|小姐|男性|女性|男生|女生)\b/gi,
  /\b(male|female|man|woman|gentleman|lady)\b/gi,
];

const agePatterns = [
  /\b(\d{1,2})\s*(岁|周岁|年龄)\b/gi,
  /\b(出生|生日|出生日期|出生年月)[：:]\s*\d{4}[-\/年]\d{1,2}[-\/月]?\d{0,2}日?/gi,
  /\b\d{4}\s*年\s*\d{1,2}\s*月\s*(出生|生日)\b/gi,
  /\b年龄[：:]\s*\d+/gi,
];

const locationPatterns = [
  /\b(籍贯|户籍|户口|出生地|居住地|现居地|所在地)[：:]\s*[\u4e00-\u9fa5]+/gi,
  /\b(来自|老家|家乡)[：:]\s*[\u4e00-\u9fa5]+/gi,
  /\b(北京|上海|广州|深圳|杭州|成都|武汉|西安|南京|重庆|天津|苏州|郑州|长沙|东莞|青岛|沈阳|宁波|昆明|大连|厦门|济南|哈尔滨|福州|长春|石家庄|南宁|南昌|贵阳|合肥|太原|乌鲁木齐|兰州|呼和浩特|银川|海口|西宁|拉萨|香港|澳门|台湾)\b/gi,
  /\b(河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|内蒙古|广西|西藏|宁夏|新疆)\b/gi,
];

const maritalStatusPatterns = [
  /\b(婚姻状况|婚否|已婚|未婚|离异|丧偶|单身)\b/gi,
  /\b(married|single|divorced|marital status)\b/gi,
];

const religionPatterns = [
  /\b(宗教信仰|信仰)[：:]\s*[\u4e00-\u9fa5]+/gi,
  /\b(佛教|道教|基督教|天主教|伊斯兰教|犹太教|印度教)\b/gi,
  /\b(religion|religious|belief)\b/gi,
];

const politicalPatterns = [
  /\b(政治面貌|党派)[：:]\s*[\u4e00-\u9fa5]+/gi,
  /\b(中共党员|预备党员|共青团员|群众|民主党派|民革|民盟|民建|民进|农工党|致公党|九三学社|台盟)\b/gi,
];

const healthPatterns = [
  /\b(健康状况|身体状况)[：:]\s*[\u4e00-\u9fa5]+/gi,
  /\b(健康|良好|一般|较差|残疾|病史)\b/gi,
];

const ethnicPatterns = [
  /\b(民族)[：:]\s*[\u4e00-\u9fa5]+/gi,
  /\b(汉族|满族|回族|蒙古族|维吾尔族|藏族|苗族|彝族|壮族|布依族|侗族|瑶族|朝鲜族|白族|土家族|哈尼族|哈萨克族|傣族|黎族|傈僳族|佤族|畲族|高山族|拉祜族|水族|东乡族|纳西族|景颇族|柯尔克孜族|土族|达斡尔族|仫佬族|羌族|布朗族|撒拉族|毛南族|仡佬族|锡伯族|阿昌族|普米族|朝鲜族|塔吉克族|怒族|乌孜别克族|俄罗斯族|鄂温克族|德昂族|保安族|裕固族|京族|塔塔尔族|独龙族|鄂伦春族|赫哲族|门巴族|珞巴族|基诺族)\b/gi,
];

const allPatterns = [
  { name: 'gender', patterns: genderPatterns },
  { name: 'age', patterns: agePatterns },
  { name: 'location', patterns: locationPatterns },
  { name: 'maritalStatus', patterns: maritalStatusPatterns },
  { name: 'religion', patterns: religionPatterns },
  { name: 'political', patterns: politicalPatterns },
  { name: 'health', patterns: healthPatterns },
  { name: 'ethnic', patterns: ethnicPatterns },
];

const fieldNames: Record<string, string> = {
  gender: '性别',
  age: '年龄',
  location: '地域',
  maritalStatus: '婚姻状况',
  religion: '宗教信仰',
  political: '政治面貌',
  health: '健康状况',
  ethnic: '民族',
};

export function checkBias(content: string): BiasCheckResult {
  const detectedFields: string[] = [];
  const maskedFields: string[] = [];

  for (const { name, patterns } of allPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        const fieldName = fieldNames[name] || name;
        if (!detectedFields.includes(fieldName)) {
          detectedFields.push(fieldName);
        }
        break;
      }
    }
  }

  let maskedContent = content;
  for (const { name, patterns } of allPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(maskedContent)) {
        const fieldName = fieldNames[name] || name;
        if (!maskedFields.includes(fieldName)) {
          maskedFields.push(fieldName);
        }
        maskedContent = maskedContent.replace(pattern, '[***已屏蔽***]');
      }
    }
  }

  return {
    detectedFields,
    maskedFields,
    isFair: detectedFields.length === 0,
  };
}

export function maskSensitiveInformation(content: string): {
  maskedContent: string;
  biasCheck: BiasCheckResult;
} {
  const biasCheck = checkBias(content);
  
  let maskedContent = content;
  for (const { patterns } of allPatterns) {
    for (const pattern of patterns) {
      maskedContent = maskedContent.replace(pattern, '[***已屏蔽***]');
    }
  }

  return {
    maskedContent,
    biasCheck,
  };
}

export function validateJobDescriptionForBias(description: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  for (const { name, patterns } of allPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(description)) {
        const fieldName = fieldNames[name] || name;
        warnings.push(`职位描述中包含可能涉及歧视的${fieldName}相关内容，请修改以确保招聘公平性`);
        break;
      }
    }
  }

  const discriminatoryWords = [
    /\b(年轻|小伙子|小姑娘|阿姨|大叔)\b/gi,
    /\b(能吃苦|任劳任怨|踏实肯干|老实)\b/gi,
    /\b(本地人优先|本地户口)\b/gi,
    /\b(限男性|限女性|适合男性|适合女性)\b/gi,
  ];

  for (const pattern of discriminatoryWords) {
    if (pattern.test(description)) {
      warnings.push(`职位描述中可能包含歧视性用语：${pattern.source}，请修改以确保招聘公平性`);
    }
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
