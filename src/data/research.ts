// 汇总后的安全数据（不含任何个人联系方式），来源：report/report_polish.md 的统计摘要
export type DataPoint = { label: string; value: number };

export const researchSummary = {
  sampleSize: 110,
  generatedAt: '2025-06-08 22:01',
  source: '问卷星',
  // 关键指标百分比（单位：%）
  keyMetrics: [
    { label: '遭遇疑似诈骗', value: 45.45 }, // 50 / 110
    { label: '女性占比（遭遇组）', value: 62 }, // 31 / 50
    { label: '大二占比（遭遇组）', value: 26 }, // 13 / 50
    { label: '虚假高薪岗位（遭遇组）', value: 86 }, // 43 / 50 risk signal高薪
  ] as DataPoint[],
  // 全体样本的主要信息来源占比
  channelOverall: [
    { label: '招聘网站', value: 58.18 },
    { label: '社交媒体', value: 51.82 },
    { label: '学校渠道', value: 36.36 },
    { label: '亲友推荐', value: 32.73 },
    { label: '线下招聘会', value: 21.82 },
    { label: '校园公告栏', value: 12.73 },
  ] as DataPoint[],
  // 曾遭遇疑似诈骗人群的渠道分布占比
  channelEncountered: [
    { label: '招聘网站', value: 86 },
    { label: '社交媒体', value: 76 },
    { label: '亲友推荐', value: 44 },
    { label: '学校渠道', value: 38 },
    { label: '线下招聘会', value: 32 },
    { label: '校园公告栏', value: 18 },
  ] as DataPoint[],
  // 受访者认为的可疑信号占比（遭遇组）
  riskSignals: [
    { label: '薪资远高于市场', value: 86 },
    { label: '索要验证码/银行卡信息', value: 86 },
    { label: '零门槛高回报', value: 84 },
    { label: '信息不透明', value: 82 },
    { label: '流程过于简单/无需考核', value: 74 },
  ] as DataPoint[],
  // 年级在“遭遇组”中的占比
  gradeEncountered: [
    { label: '大一', value: 14 },
    { label: '大二', value: 26 },
    { label: '大三', value: 28 },
    { label: '大四', value: 28 },
    { label: '研及以上', value: 4 },
  ] as DataPoint[],
  recommendations: [
    '课程化反诈教育：纳入就业/生涯课程，结合学业场景。',
    '情境化演练：案例推演与角色扮演，强化应对与决策。',
    '渠道化宣传：招聘网站 / 社交媒体首屏提示与核验引导。',
    '工具化核验：企业信用公示 + 一键核验清单，先查再投递。',
  ],
};

