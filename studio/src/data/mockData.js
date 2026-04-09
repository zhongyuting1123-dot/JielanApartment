// ─── 权限模块定义 ────────────────────────────────────────────────────────────

export const permissionModules = [
  { key: 'ai_toolbox', label: 'AI 工具箱', desc: 'AI 生图、分镜头脚本、镜头编辑等工具' },
  { key: 'digital_ops', label: '数字人运营', desc: '客户管理、创作工作台、数据看板' },
];

// ─── 角色配置 ────────────────────────────────────────────────────────────────

export const roleConfig = {
  superadmin: { label: '系统管理员', color: '#FF3B30', bg: '#FFF0EF' },
  admin:      { label: '管理员',     color: '#0071E3', bg: 'var(--color-primary-bg)' },
  member:     { label: '成员',       color: '#6E6E73', bg: 'rgba(0,0,0,0.04)' },
};

// ─── 用户与角色 ──────────────────────────────────────────────────────────────

export const users = [
  { id: 0, name: '超管', role: 'superadmin', avatar: '超', department: '系统', color: '#FF3B30', phone: '13800000000', permissions: { ai_toolbox: true, digital_ops: true } },
  { id: 1, name: '张运营', role: 'admin', avatar: '张', department: '广创部', color: '#0071E3', phone: '13800000001', permissions: { ai_toolbox: true, digital_ops: true } },
  { id: 2, name: '李小红', role: 'member', avatar: '李', department: '广创部', color: '#34C759', phone: '13800000002', permissions: { ai_toolbox: true, digital_ops: true } },
  { id: 3, name: '王视频', role: 'member', avatar: '王', department: '广创部', color: '#FF9F0A', phone: '13800000003', permissions: { ai_toolbox: true, digital_ops: true } },
];

// ─── 客户 ────────────────────────────────────────────────────────────────────

export const clients = [
  {
    id: 1,
    name: '盛禾美学',
    industry: '美容护肤',
    direction: '抗衰 / 成分党',
    avatar: '盛',
    accountCount: 3,
    projectCount: 12,
    status: 'active',
    createdAt: '2024-09',
    platforms: ['抖音', '小红书', '视频号'],
    accounts: [
      { id: 1, platform: '抖音', name: '@盛禾美学官方', keywords: ['抗衰', '成分党', '护肤'], style: '知识型 · 专业', target: '品牌专业度建设，吸引成分党粉丝', plan: '## 账号定位\n专业护肤知识分享账号，以成分解析为核心内容。\n\n## 内容策略\n1. 成分科普（40%）：热门成分深度解读\n2. 产品测评（30%）：真实使用反馈\n3. 护肤教程（20%）：场景化教学\n4. 粉丝互动（10%）：问答、抽奖\n\n## 发布节奏\n每周 3-4 条，集中在 19:00-21:00 发布' },
      { id: 2, platform: '小红书', name: '@盛禾种草', keywords: ['护肤', '测评', '好物'], style: '生活化 · 真实感', target: '种草转化，提升产品口碑', plan: '## 账号定位\n真实护肤体验分享，贴近生活的种草账号。\n\n## 内容策略\n1. 好物分享（50%）：产品使用前后对比\n2. 护肤日常（30%）：真实护肤流程\n3. 合集推荐（20%）：按场景/肤质推荐\n\n## 发布节奏\n每周 5-6 条，12:00-14:00 和 20:00-22:00 双时段' },
      { id: 3, platform: '视频号', name: '盛禾美学', keywords: ['品牌', '直播'], style: '品牌形象型', target: '品牌形象传播，配合直播活动', plan: '## 账号定位\n品牌官方形象窗口，配合直播做转化。\n\n## 内容策略\n1. 品牌故事（40%）：理念、研发、幕后\n2. 直播预热（30%）：活动预告、福利\n3. 用户见证（30%）：客户案例、反馈\n\n## 发布节奏\n每周 2 条，配合直播节点' },
    ],
    digitalHumans: {
      avatars: [
        { id: 1, name: '晴晴', status: 'ready', desc: '年轻活力女性形象，适合产品种草类内容', fileName: 'qingqing_training.mp4' },
        { id: 2, name: '专家形象', status: 'training', desc: '专业医美顾问形象', fileName: 'expert_v2.mp4' },
      ],
      voices: [
        { id: 1, name: '温柔女声', status: 'ready', desc: '适合护肤科普和产品介绍', fileName: 'gentle_female.wav' },
      ],
    },
    profile: {
      audience: '25-40岁女性，注重品质，有一定消费力',
      goal: '月增粉5k+，提升品牌专业度，带动线下到店',
      tone: '专业、亲和、有科学依据',
      avoid: '不做夸大宣传，不对比竞品',
    },
    operationPlan: '## 运营策略概述\n围绕"抗衰/成分党"核心方向，采用"专业知识+真实体验"双轮驱动策略，建立品牌在护肤领域的专业信任度。\n\n## 内容矩阵规划\n1. 知识科普类（40%）：成分解析、护肤原理、肌肤问题解答\n2. 产品种草类（30%）：使用体验分享、前后对比、成分分析\n3. 互动引流类（20%）：问答互动、投票、抽奖引流私域\n4. 品牌故事类（10%）：品牌理念、研发故事、幕后花絮\n\n## 多平台协同\n- 抖音（主阵地）：短视频知识科普，快速建立专业认知\n- 小红书（种草场）：图文+视频种草，提升产品口碑\n- 视频号（品牌窗口）：品牌形象传播，配合直播做转化\n\n## 增长目标路径\n- 第1月：建立内容基线，测试各平台内容方向\n- 第2-3月：优化高互动内容，月增粉3k+\n- 第4-6月：稳定输出，月增粉5k+，启动私域社群转化\n- 第7-12月：品效合一，带动线下到店率提升15%',
  },
  {
    id: 2,
    name: '云间教育',
    industry: '在线教育',
    direction: 'K12 / 学习方法',
    avatar: '云',
    accountCount: 2,
    projectCount: 8,
    status: 'active',
    createdAt: '2024-11',
    platforms: ['抖音', 'B站'],
    accounts: [
      { id: 1, platform: '抖音', name: '@云间学习法', keywords: ['学习方法', '高效', '中学生'], style: '干货型 · 快节奏', target: '吸引中学生和家长关注', plan: '## 账号定位\n高效学习方法分享，面向初高中生群体。\n\n## 内容策略\n1. 学习技巧（50%）：记忆法、时间管理\n2. 考试攻略（30%）：各科解题技巧\n3. 学习动力（20%）：励志、心态调整\n\n## 发布节奏\n每周 4-5 条，放学时段 17:00-18:00' },
      { id: 2, platform: 'B站', name: '云间教育', keywords: ['学习', '考试', '技巧'], style: '深度解析型', target: '深度内容沉淀，转化课程用户', plan: '## 账号定位\n深度学习方法解析，长视频知识沉淀。\n\n## 内容策略\n1. 专题课程（60%）：系统化学习方法\n2. 考试复盘（25%）：真题解析\n3. 学习vlog（15%）：高效学习日常\n\n## 发布节奏\n每周 2-3 条，周末集中发布' },
    ],
    digitalHumans: {
      avatars: [
        { id: 1, name: '李老师', status: 'ready', desc: '亲和力强的中年教师形象', fileName: 'li_teacher.mp4' },
      ],
      voices: [
        { id: 1, name: '教师男声', status: 'ready', desc: '沉稳有力的教师声线', fileName: 'teacher_male.wav' },
      ],
    },
    profile: {
      audience: '初高中生及家长',
      goal: '引流至私域社群，转化课程',
      tone: '亲切、正向、实用',
      avoid: '不制造焦虑',
    },
    operationPlan: '## 运营策略概述\n以"高效学习方法"为核心卖点，通过短视频吸引流量，长视频建立信任，最终导流私域完成课程转化。\n\n## 内容矩阵规划\n1. 学习技巧类（45%）：记忆法、笔记法、时间管理\n2. 考试攻略类（30%）：各科解题思路、真题解析\n3. 学习动力类（15%）：心态调整、励志故事\n4. 课程引流类（10%）：课程片段、学员反馈\n\n## 增长目标路径\n- 第1-2月：建立内容体系，测试爆款方向\n- 第3-4月：稳定产出，月增粉2k+，启动社群\n- 第5-6月：课程转化率提升至5%+',
  },
  {
    id: 3,
    name: '拾野咖啡',
    industry: '餐饮/新消费',
    direction: '精品咖啡 / 城市探店',
    avatar: '拾',
    accountCount: 2,
    projectCount: 5,
    status: 'active',
    createdAt: '2025-01',
    platforms: ['小红书', '抖音'],
    accounts: [
      { id: 1, platform: '小红书', name: '@拾野咖啡', keywords: ['精品咖啡', '探店', '成都'], style: '生活美学型', target: '打造城市咖啡打卡地标', plan: '## 账号定位\n成都精品咖啡美学生活方式账号。\n\n## 内容策略\n1. 门店打卡（40%）：空间美学、拍照攻略\n2. 咖啡知识（30%）：豆子、冲煮、品鉴\n3. 新品推荐（30%）：季节限定、特调\n\n## 发布节奏\n每周 4-5 条，上午 10:00 和下午 15:00' },
      { id: 2, platform: '抖音', name: '@拾野咖啡STUDIO', keywords: ['咖啡制作', '门店', '探店打卡'], style: '视觉型 · 沉浸感', target: '视觉化传播，提升门店曝光', plan: '## 账号定位\n沉浸式咖啡制作与门店体验。\n\n## 内容策略\n1. 制作过程（50%）：ASMR风格冲煮\n2. 门店体验（30%）：空间、氛围\n3. 探店联动（20%）：与博主合作\n\n## 发布节奏\n每周 3 条，下午 14:00-16:00' },
    ],
    digitalHumans: {
      avatars: [],
      voices: [],
    },
    profile: {
      audience: '18-32岁，城市白领，精品生活爱好者',
      goal: '提升门店曝光，吸引到店打卡',
      tone: '慢节奏、有质感、真实',
      avoid: '不做硬广感内容',
    },
    operationPlan: '## 运营策略概述\n以"精品咖啡生活美学"为主线，通过视觉化内容吸引城市年轻人群，线上引流带动线下到店。\n\n## 内容矩阵规划\n1. 门店打卡类（35%）：空间美学、拍照攻略、探店体验\n2. 咖啡文化类（25%）：产地故事、冲煮方法、品鉴技巧\n3. 新品推广类（25%）：季节限定、创意特调\n4. 用户共创类（15%）：打卡返图、口味投票\n\n## 增长目标路径\n- 第1月：建立视觉风格，积累种子用户\n- 第2-3月：联动本地博主，月增粉1.5k+\n- 第4-6月：形成打卡效应，周末到店率提升20%',
  },
];

export const projects = [
  {
    id: 1,
    clientId: 1,
    clientName: '盛禾美学',
    name: '烟酰胺功效科普系列',
    account: '@盛禾美学官方',
    platform: '抖音',
    status: 'production',
    assigneeId: 1,
    assigneeName: '张运营',
    createdAt: '2025-03-10',
    updatedAt: '2025-03-18',
  },
  {
    id: 2,
    clientId: 1,
    clientName: '盛禾美学',
    name: '春季换肤指南',
    account: '@盛禾种草',
    platform: '小红书',
    status: 'published',
    assigneeId: 2,
    assigneeName: '李小红',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-15',
    publishTime: '2025-03-15 19:30',
    publishLink: 'https://www.xiaohongshu.com/explore/abc123',
  },
  {
    id: 3,
    clientId: 2,
    clientName: '云间教育',
    name: '高考倒计时·记忆法专题',
    account: '@云间学习法',
    platform: '抖音',
    status: 'draft',
    assigneeId: 3,
    assigneeName: '王视频',
    createdAt: '2025-03-15',
    updatedAt: '2025-03-17',
  },
  {
    id: 4,
    clientId: 2,
    clientName: '云间教育',
    name: '数学压轴题解题逻辑',
    account: '@云间学习法',
    platform: '抖音',
    status: 'completed',
    assigneeId: 3,
    assigneeName: '王视频',
    createdAt: '2025-03-05',
    updatedAt: '2025-03-16',
  },
  {
    id: 5,
    clientId: 3,
    clientName: '拾野咖啡',
    name: '春日限定·樱花季新品',
    account: '@拾野咖啡',
    platform: '小红书',
    status: 'published',
    assigneeId: 2,
    assigneeName: '李小红',
    createdAt: '2025-02-28',
    updatedAt: '2025-03-12',
    publishTime: '2025-03-12 20:00',
    publishLink: 'https://www.xiaohongshu.com/explore/def456',
  },
  {
    id: 6,
    clientId: 1,
    clientName: '盛禾美学',
    name: '敏感肌修护专题',
    account: '@盛禾美学官方',
    platform: '抖音',
    status: 'draft',
    assigneeId: 1,
    assigneeName: '张运营',
    createdAt: '2025-03-18',
    updatedAt: '2025-03-18',
  },
];

export const statusConfig = {
  draft:      { label: '草稿',   color: '#8A8580', bg: '#F0EFEC' },
  production: { label: '生产中', color: '#C9A96E', bg: '#F5EDD8' },
  completed:  { label: '已完成', color: '#6B8FA8', bg: '#E8F0F5' },
  published:  { label: '已发布', color: '#6A9E7A', bg: '#E8F3EC' },
};

export const platformColors = {
  '抖音':  '#1C1A17',
  '小红书': '#E84C4C',
  '视频号': '#07C160',
  'B站':   '#FB7299',
};
