// 防骗测验题库

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: 'scenario' | 'single'; // 情境题 or 单选题
  category: string; // 对应的预警类别
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  scenario?: string; // 情境题的场景描述
  options: QuizOption[];
  correctAnswer: string; // 正确答案的option id
  explanation: string; // 答案解析
}

// 完整题库
export const quizQuestions: QuizQuestion[] = [
  // ========== 金钱相关 ==========
  {
    id: 'f1',
    type: 'scenario',
    category: 'financial',
    difficulty: 'easy',
    question: '这个招聘信息可能存在问题吗？',
    scenario: '小李收到一份招聘信息："诚招校园代理，日薪300-500元，无需经验，入职需缴纳500元保证金，离职全额退还。"',
    options: [
      { id: 'a', text: '正常的，保证金离职会退还' },
      { id: 'b', text: '可疑，正规工作不应收取保证金' },
      { id: 'c', text: '薪资偏高，其他没问题' },
      { id: 'd', text: '需要进一步了解公司情况' },
    ],
    correctAnswer: 'b',
    explanation: '正规招聘不会以任何名义向求职者收取费用。"保证金""押金""培训费"都是常见的诈骗手段。',
  },
  {
    id: 'f2',
    type: 'scenario',
    category: 'financial',
    difficulty: 'medium',
    question: '面对这种情况，小王应该怎么做？',
    scenario: '小王面试通过后，HR说："恭喜你！入职前需要购买公司统一的工作设备（笔记本电脑），费用3000元，从前三个月工资扣除。"',
    options: [
      { id: 'a', text: '同意，毕竟是工作需要' },
      { id: 'b', text: '拒绝，正规公司应提供工作设备' },
      { id: 'c', text: '讨价还价，看能否降低费用' },
      { id: 'd', text: '同意，但要求开具正规发票' },
    ],
    correctAnswer: 'b',
    explanation: '正规公司会为员工提供工作所需设备，不会要求员工自费购买。这是典型的"设备费"骗局。',
  },
  {
    id: 'f3',
    type: 'single',
    category: 'financial',
    difficulty: 'easy',
    question: '以下哪种情况最可能是求职诈骗？',
    options: [
      { id: 'a', text: '面试后要求等待背景调查结果' },
      { id: 'b', text: '入职前要求体检并自费支付' },
      { id: 'c', text: '入职前要求转账"培训费"' },
      { id: 'd', text: '入职前签署竞业协议' },
    ],
    correctAnswer: 'c',
    explanation: '任何要求求职者在入职前转账的行为都是诈骗。虽然入职体检自费在某些情况下存在，但"培训费"是明确的诈骗信号。',
  },
  
  // ========== 公司背景 ==========
  {
    id: 'c1',
    type: 'scenario',
    category: 'company',
    difficulty: 'medium',
    question: '小张应该如何判断这家公司？',
    scenario: '小张收到面试邀请，公司名为"XX科技有限公司"，但在天眼查上搜索发现：注册资本5000万，成立仅3个月，注册地址是居民小区。',
    options: [
      { id: 'a', text: '注册资本高说明公司实力强' },
      { id: 'b', text: '新公司可能更有发展潜力' },
      { id: 'c', text: '存在风险，建议谨慎考虑' },
      { id: 'd', text: '只看公司名称就能判断' },
    ],
    correctAnswer: 'c',
    explanation: '注册资本虚高但成立时间短、注册地址在居民区，这些都是空壳公司的典型特征，需要高度警惕。',
  },
  {
    id: 'c2',
    type: 'single',
    category: 'company',
    difficulty: 'easy',
    question: '以下哪种公司信息最值得警惕？',
    options: [
      { id: 'a', text: '公司成立10年，员工500人' },
      { id: 'b', text: '公司只提供手机号，无固定电话' },
      { id: 'c', text: '公司有独立办公楼' },
      { id: 'd', text: '公司有官方网站和企业邮箱' },
    ],
    correctAnswer: 'b',
    explanation: '正规公司通常会有固定电话、企业邮箱等官方联系方式。只提供手机号可能是个人行为或诈骗。',
  },

  // ========== 招聘流程 ==========
  {
    id: 'p1',
    type: 'scenario',
    category: 'process',
    difficulty: 'easy',
    question: '这个招聘流程正常吗？',
    scenario: '小陈投递简历后，10分钟内就收到录用通知："恭喜通过！无需面试，明天直接入职，薪资8000元/月。"',
    options: [
      { id: 'a', text: '运气好，简历写得很优秀' },
      { id: 'b', text: '高度可疑，正规招聘不会如此草率' },
      { id: 'c', text: '可能是急招岗位' },
      { id: 'd', text: '先去看看再说' },
    ],
    correctAnswer: 'b',
    explanation: '正规招聘需要经过简历筛选、面试等环节。"无需面试直接录用"是典型的诈骗信号，可能是传销或其他骗局。',
  },
  {
    id: 'p2',
    type: 'scenario',
    category: 'process',
    difficulty: 'hard',
    question: '小林应该如何回应？',
    scenario: 'HR发消息："名额只剩最后一个，必须今天下午5点前回复，否则机会就没了。另外需要提供身份证正反面照片和银行卡号用于入职登记。"',
    options: [
      { id: 'a', text: '赶紧提供，抓住这个机会' },
      { id: 'b', text: '先提供信息，入职后再核实' },
      { id: 'c', text: '拒绝，这是典型的诈骗话术' },
      { id: 'd', text: '只提供身份证，不提供银行卡' },
    ],
    correctAnswer: 'c',
    explanation: '制造紧迫感是诈骗常用手段，正规公司不会催促立即决定。入职前要求银行卡号更是明显的诈骗信号。',
  },
  {
    id: 'p3',
    type: 'single',
    category: 'process',
    difficulty: 'medium',
    question: '以下哪种情况需要特别警惕？',
    options: [
      { id: 'a', text: '面试需要准备作品集' },
      { id: 'b', text: '面试后需要等待一周通知' },
      { id: 'c', text: '签合同前要求签署空白协议' },
      { id: 'd', text: '入职后有3个月试用期' },
    ],
    correctAnswer: 'c',
    explanation: '签署任何空白文件都是极其危险的行为，可能被用于伪造合同或贷款协议。',
  },

  // ========== 沟通方式 ==========
  {
    id: 'm1',
    type: 'scenario',
    category: 'communication',
    difficulty: 'medium',
    question: '这种联系方式正常吗？',
    scenario: '小李在招聘平台上收到消息："加我微信详聊，微信号xxx。"对方微信头像是企业logo，但朋友圈只有几条励志鸡汤。',
    options: [
      { id: 'a', text: '正常，现在都用微信沟通' },
      { id: 'b', text: '可疑，应该通过平台或企业邮箱沟通' },
      { id: 'c', text: '看朋友圈内容就能判断' },
      { id: 'd', text: '先加微信了解情况' },
    ],
    correctAnswer: 'b',
    explanation: '正规HR应该通过招聘平台或企业邮箱联系。个人微信沟通难以核实身份，是诈骗的常见渠道。',
  },
  {
    id: 'm2',
    type: 'single',
    category: 'communication',
    difficulty: 'easy',
    question: '以下哪种联系方式最可信？',
    options: [
      { id: 'a', text: '个人QQ号' },
      { id: 'b', text: '企业邮箱（如hr@company.com）' },
      { id: 'c', text: '个人手机号' },
      { id: 'd', text: '私人微信号' },
    ],
    correctAnswer: 'b',
    explanation: '企业邮箱与公司域名绑定，难以伪造，是最可靠的官方联系方式。',
  },

  // ========== 网络招聘 ==========
  {
    id: 'o1',
    type: 'scenario',
    category: 'online',
    difficulty: 'easy',
    question: '这份兼职可靠吗？',
    scenario: '小美看到招聘："居家兼职，打字员，日结200-500元，无需经验，自由安排时间。有意者联系QQ：xxx"',
    options: [
      { id: 'a', text: '可以尝试，反正不用投资' },
      { id: 'b', text: '典型的网络诈骗，绝对不能信' },
      { id: 'c', text: '薪资合理，可以考虑' },
      { id: 'd', text: '先了解具体工作内容' },
    ],
    correctAnswer: 'b',
    explanation: '"打字员""录入员"是最常见的网络诈骗类型。实际操作中会以各种理由要求交费或刷单。',
  },
  {
    id: 'o2',
    type: 'scenario',
    category: 'online',
    difficulty: 'hard',
    question: '这个"内推"机会真实吗？',
    scenario: '某社交平台上有人发帖："大厂内推资源，保证面试机会，需支付500元信息费。已成功帮助100+同学拿到offer。"',
    options: [
      { id: 'a', text: '500元不多，可以试试' },
      { id: 'b', text: '有成功案例，应该可信' },
      { id: 'c', text: '明显是骗局，正规内推不收费' },
      { id: 'd', text: '先付一半，拿到面试再付另一半' },
    ],
    correctAnswer: 'c',
    explanation: '真正的内推是免费的。任何收费的"内推服务"都是骗局，即使提供所谓的"成功案例"也不可信。',
  },

  // ========== 身份假冒 ==========
  {
    id: 'i1',
    type: 'scenario',
    category: 'identity',
    difficulty: 'medium',
    question: '这条消息可信吗？',
    scenario: '小周收到短信："同学你好，我是学校就业中心张老师，有一个实习机会推荐给你，请加微信xxx详聊。"',
    options: [
      { id: 'a', text: '学校老师推荐，应该可信' },
      { id: 'b', text: '先加微信了解情况' },
      { id: 'c', text: '应先向学校就业中心核实' },
      { id: 'd', text: '看微信聊天内容再判断' },
    ],
    correctAnswer: 'c',
    explanation: '冒充学校老师是常见的诈骗手段。应该通过学校官方渠道（如就业中心电话、官网）核实信息真伪。',
  },
  {
    id: 'i2',
    type: 'single',
    category: 'identity',
    difficulty: 'medium',
    question: '如何识别假冒知名企业的招聘？',
    options: [
      { id: 'a', text: '看招聘信息是否发布在官网' },
      { id: 'b', text: '看薪资是否与市场行情一致' },
      { id: 'c', text: '看公司名称是否完全一致' },
      { id: 'd', text: '以上都需要核实' },
    ],
    correctAnswer: 'd',
    explanation: '识别假冒需要多方面验证：通过官网确认招聘信息、核实公司名称（注意是否多字少字）、对比薪资待遇等。',
  },

  // ========== 合同陷阱 ==========
  {
    id: 't1',
    type: 'scenario',
    category: 'contract',
    difficulty: 'hard',
    question: '这份合同有什么问题？',
    scenario: '小赵入职签合同时发现：试用期6个月，试用期工资为转正后的50%，且培训期间离职需赔偿培训费2万元。',
    options: [
      { id: 'a', text: '正常的，公司有培训成本' },
      { id: 'b', text: '试用期太长但其他条款正常' },
      { id: 'c', text: '多处违法，应拒绝签署' },
      { id: 'd', text: '可以协商修改' },
    ],
    correctAnswer: 'c',
    explanation: '根据劳动法：合同期3年以上试用期最长6个月，试用期工资不得低于转正后的80%。"培训费"条款也涉嫌违法。',
  },
  {
    id: 't2',
    type: 'single',
    category: 'contract',
    difficulty: 'medium',
    question: '签署劳动合同时，以下哪项最重要？',
    options: [
      { id: 'a', text: '确保合同上公司盖章' },
      { id: 'b', text: '确保自己保留一份合同副本' },
      { id: 'c', text: '确保所有条款自己都理解' },
      { id: 'd', text: '以上都很重要' },
    ],
    correctAnswer: 'd',
    explanation: '签署劳动合同时需要注意：公司盖章确保效力、自己保留副本作为凭证、理解所有条款避免陷阱。',
  },

  // ========== 特殊骗局 ==========
  {
    id: 's1',
    type: 'scenario',
    category: 'special',
    difficulty: 'medium',
    question: '这个机会可信吗？',
    scenario: '小吴看到招聘："跨境电商运营，月入2-5万，无需经验，公司提供培训。入职需购买3980元的跨境店铺。"',
    options: [
      { id: 'a', text: '跨境电商确实很赚钱' },
      { id: 'b', text: '投资3980元不多，可以尝试' },
      { id: 'c', text: '这是典型的"加盟骗局"' },
      { id: 'd', text: '先了解培训内容再决定' },
    ],
    correctAnswer: 'c',
    explanation: '任何要求先付费购买"店铺""代理权""加盟资格"的都是骗局。真正的工作不需要员工先投资。',
  },
  {
    id: 's2',
    type: 'scenario',
    category: 'special',
    difficulty: 'hard',
    question: '这份工作安全吗？',
    scenario: '小刘收到高薪工作邀请：负责"网络客服"，远程办公，月薪15000元，工作内容是在网上引导客户"理财投资"。',
    options: [
      { id: 'a', text: '远程办公很方便，可以尝试' },
      { id: 'b', text: '高薪但描述模糊，需谨慎' },
      { id: 'c', text: '涉嫌电信诈骗帮凶，绝对不能做' },
      { id: 'd', text: '先试工几天看看' },
    ],
    correctAnswer: 'c',
    explanation: '"引导理财投资"实际上是为诈骗团伙工作。参与此类工作不仅会被骗，还可能触犯刑法成为电信诈骗共犯。',
  },
  {
    id: 's3',
    type: 'single',
    category: 'special',
    difficulty: 'easy',
    question: '以下哪种工作最可能涉及违法？',
    options: [
      { id: 'a', text: '超市收银员' },
      { id: 'b', text: '快递分拣员' },
      { id: 'c', text: '网络刷单员' },
      { id: 'd', text: '餐厅服务员' },
    ],
    correctAnswer: 'c',
    explanation: '刷单本身就是违法行为（虚假交易），且刷单骗局会要求垫付资金，最终资金无法追回。',
  },
];

// 按难度获取题目
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'all'): QuizQuestion[] => {
  if (difficulty === 'all') return quizQuestions;
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

// 随机抽取指定数量的题目
export const getRandomQuestions = (count: number, difficulty?: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  let pool = difficulty ? getQuestionsByDifficulty(difficulty) : quizQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// 按类别获取题目
export const getQuestionsByCategory = (categoryId: string): QuizQuestion[] => {
  return quizQuestions.filter(q => q.category === categoryId);
};

// 难度配置
export const difficultyConfig = {
  easy: { label: '简单', time: 45, questions: 10, color: '#22c55e' },
  medium: { label: '中等', time: 30, questions: 10, color: '#f59e0b' },
  hard: { label: '困难', time: 20, questions: 10, color: '#ef4444' },
};

