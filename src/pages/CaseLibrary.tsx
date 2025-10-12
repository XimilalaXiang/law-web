import React, { useState } from 'react';
import { SearchIcon, FilterIcon, AlertCircleIcon, ShieldCheckIcon } from 'lucide-react';
// Real case data from 案例.md with additional cases
const realCases = [{
  id: 1,
  title: '特大招聘诈骗案：涉案8000万元',
  summary: '犯罪嫌疑人于某以能办理央企、国企等单位正式员工入职为由，对400多名大学毕业生实施招工、招干诈骗，涉案金额超8000万元。',
  type: '央企国企诈骗',
  date: '2024-06-15',
  warning_signs: ['声称能办理央企国企入职', '要求缴纳高额费用', '提供虚假劳动合同', '组织虚假培训和考试']
}, {
  id: 2,
  title: '"央企内推""直签保录"骗局',
  summary: '不法分子以"央企内推""直签保录"等形式向应聘者承诺安排到知名企业工作，并以此收取费用，实际上无任何内推能力。',
  type: '内推诈骗',
  date: '2025-01-20',
  warning_signs: ['承诺央企内推', '要求支付内推费用', '无法提供官方证明', '通过非正规渠道联系']
}, {
  id: 3,
  title: '横琴刷单诈骗案：两人被骗43万',
  summary: '澳门在读大学生和金融岛上班族因轻信网络"刷单"骗局，在所谓"做任务"的过程中分别被骗走32万元和11万元。',
  type: '刷单诈骗',
  date: '2025-02-26',
  warning_signs: ['以求职为名诱导刷单', '要求垫付资金做任务', '声称操作失误需继续转账', '要求线下交付现金']
}, {
  id: 4,
  title: '"培训贷"套路大学生案例',
  summary: '培训机构以"边学边赚钱""先学后付"等承诺，诱导学生向网络借贷平台贷款支付培训费用，但课程质量低劣且无法提供承诺的兼职机会。',
  type: '培训贷诈骗',
  date: '2023-07-15',
  warning_signs: ['承诺培训后包找工作', '要求分期付款或贷款', '声称边学边赚钱', '退费困难重重']
}, {
  id: 5,
  title: '"共享经济创业"圈钱骗局',
  summary: '某公司打着"共享经济创业"幌子，以"回报快、回报高"诱饵吸引大学生投资，承诺推荐他人可获高额佣金，最终人去楼空。',
  type: '创业诈骗',
  date: '2025-03-29',
  warning_signs: ['打着共享经济旗号', '承诺高额快速回报', '要求发展下线', '办公地点突然人去楼空']
}, {
  id: 6,
  title: '"高薪招聘"培训诈骗陷阱',
  summary: '四川某教育科技公司针对大学生发布虚假高薪招聘信息，诱导求职者参加培训并收取费用，诈骗400余名求职大学生131万元。',
  type: '招聘培训诈骗',
  date: '2024-08-10',
  warning_signs: ['发布虚假高薪招聘', '要求持证上岗', '收取培训费用', '岗位根本不存在']
}, {
  id: 7,
  title: '"托关系""付费内推"诈骗',
  summary: '不法分子谎称认识某国企领导，以30万元保证安排正式编制工作为由实施诈骗，收取费用后以各种理由推脱。',
  type: '关系诈骗',
  date: '2023-11-05',
  warning_signs: ['声称认识企业领导', '承诺安排正式编制', '要求支付巨额费用', '无法提供具体进展']
}, {
  id: 8,
  title: '网络传销"线上创业"骗局',
  summary: '犯罪分子搭建"名鸽派MGP"APP平台，以"线上创业""发展团队"为名，形成18级以上传销网络结构，涉案金额9亿余元。',
  type: '网络传销',
  date: '2024-12-20',
  warning_signs: ['承诺线上创业机会', '要求发展下线', '形成多级返利结构', '投资门槛不断提高']
}, {
  id: 9,
  title: '求职遭遇刷单诈骗案',
  summary: '女子求职时收到陌生邮件邀请面试，被要求完成"入职测试"刷单任务，险些被骗5.4万元，幸被警方及时劝阻。',
  type: '求职刷单诈骗',
  date: '2025-04-20',
  warning_signs: ['以入职测试为名', '要求完成刷单任务', '先给小额返利获取信任', '要求大额线下充值']
}, {
  id: 10,
  title: '暑期兼职"黑中介"陷阱',
  summary: '大学生暑期兼职遭遇"黑中介"，被要求交纳保证金和培训费，承诺的高薪工作变成低薪保安，最终被无故开除。',
  type: '黑中介诈骗',
  date: '2024-07-25',
  warning_signs: ['要求交纳保证金', '承诺高薪工作', '实际工作与承诺不符', '随意解除劳动关系']
}, {
  id: 11,
  title: '海外高薪务工诈骗案',
  summary: '诈骗团伙以高薪招聘赴东南亚工作为名，诱骗多名大学生出境，抵达后扣押护照强迫从事电信诈骗活动，有学生被限制人身自由长达半年。',
  type: '海外务工诈骗',
  date: '2024-09-12',
  warning_signs: ['承诺海外高薪工作', '要求先交护照办理费', '抵达后扣押证件', '强迫从事违法活动']
}, {
  id: 12,
  title: '网络主播招聘陷阱',
  summary: '某传媒公司以招聘网络主播为名，要求应聘者缴纳形象设计费、平台入驻费等，承诺月入过万，实际平台无流量支持，所谓"保底收入"从未兑现。',
  type: '主播诈骗',
  date: '2025-01-08',
  warning_signs: ['要求缴纳形象设计费', '承诺保底收入', '平台无实际流量', '拒绝退还费用']
}, {
  id: 13,
  title: '打字员高薪兼职骗局',
  summary: '女大学生看到"日薪300元打字员"招聘信息，交纳会员费后发现所谓工作内容是抄写小说，完成后对方以"质量不合格"为由拒绝结算并拉黑。',
  type: '打字员诈骗',
  date: '2024-10-20',
  warning_signs: ['宣称日薪过高', '要求先交会员费', '工作要求模糊', '以质量问题拒付工资']
}, {
  id: 14,
  title: '快递录单员诈骗陷阱',
  summary: '诈骗分子发布"快递录单员"招聘信息，声称工作简单每单结算，要求应聘者先交保证金和培训费，收钱后就失联。',
  type: '录单员诈骗',
  date: '2024-11-15',
  warning_signs: ['承诺按单结算', '要求交保证金', '声称零基础可做', '收费后失联']
}, {
  id: 15,
  title: '游戏代练诈骗案例',
  summary: '某游戏工作室招聘代练员，要求应聘者先租赁游戏账号并缴纳押金，承诺完成任务后返还。学生交钱后发现账号无法使用，对方已失联。',
  type: '游戏代练诈骗',
  date: '2024-12-03',
  warning_signs: ['要求租赁账号', '收取高额押金', '任务难度过高', '无法联系到雇主']
}, {
  id: 16,
  title: '虚假实习岗位诈骗',
  summary: '某咨询公司以提供知名企业实习机会为名，收取每人3-5万元的"实习安排费"，承诺实习后可转正，实际安排的是短期临时工作，转正承诺从未兑现。',
  type: '实习诈骗',
  date: '2024-05-18',
  warning_signs: ['收取高额实习安排费', '承诺100%转正', '无法提供企业确认', '实习内容与承诺不符']
}, {
  id: 17,
  title: '保险销售诱导贷款案',
  summary: '保险公司以招聘销售代表为名，要求新人自己先购买保险产品"体验"，诱导大学生贷款购买高额保险，造成学生背负数万元债务。',
  type: '保险诈骗',
  date: '2024-04-22',
  warning_signs: ['要求员工自购产品', '诱导贷款购买', '承诺可退款', '实际退款困难']
}, {
  id: 18,
  title: '微商代理囤货骗局',
  summary: '诈骗团伙以"零投入创业"为幌子招募微商代理，诱导学生大量囤货，承诺包销和高额返利，实际货物滞销且无法退货，造成学生经济损失。',
  type: '微商诈骗',
  date: '2025-02-10',
  warning_signs: ['承诺包销售', '要求大量囤货', '宣传暴利回报', '货物无法退换']
}, {
  id: 19,
  title: '电商客服培训骗局',
  summary: '某公司招聘电商客服，要求应聘者参加为期一周的付费培训，收取2000元培训费后，以"考核不合格"为由拒绝录用，培训费不予退还。',
  type: '客服培训诈骗',
  date: '2024-08-28',
  warning_signs: ['必须参加付费培训', '考核标准不明确', '大部分人考核不通过', '培训费不退还']
}, {
  id: 20,
  title: '家教中介诈骗案',
  summary: '家教中介收取大学生300-500元信息费，承诺提供多个家教机会，实际提供的联系方式多为无效信息，家长要么不存在要么早已找到老师。',
  type: '家教中介诈骗',
  date: '2024-09-05',
  warning_signs: ['收取信息费', '承诺大量家教机会', '提供虚假联系方式', '不承诺成功率']
}, {
  id: 21,
  title: '影视群演招聘陷阱',
  summary: '某影视公司招聘群众演员，要求应聘者缴纳档案费、拍摄费等，承诺每天有戏拍，实际一个月才安排1-2次拍摄，且报酬远低于承诺。',
  type: '群演诈骗',
  date: '2024-06-30',
  warning_signs: ['收取档案费', '承诺每天有工作', '实际工作量极少', '片酬远低于承诺']
}, {
  id: 22,
  title: '刷信誉兼职连环骗',
  summary: '诈骗分子以刷单兼职为名，先让受害者完成小额任务获得返利取得信任，随后以"系统升级""大额任务高返利"为由，诱导受害者垫付大额资金，涉案金额达15万元。',
  type: '刷单诈骗',
  date: '2025-03-15',
  warning_signs: ['先给小额返利', '逐步提高垫付金额', '以系统故障为由拖延', '要求继续充值解冻']
}, {
  id: 23,
  title: '网络兼职刷评论骗局',
  summary: '某电商平台招聘"评论员"，声称只需复制粘贴评论即可赚钱，要求先购买商品再返现，大学生购买后发现返现无法到账，商家也失去联系。',
  type: '刷评论诈骗',
  date: '2024-10-08',
  warning_signs: ['要求先购买商品', '承诺购买后返现', '返现迟迟不到账', '客服无法联系']
}, {
  id: 24,
  title: 'KTV招聘服务员陷阱',
  summary: '某KTV以招聘服务员为名，面试时要求女大学生试穿演出服装并拍照，以"形象不符"为由拒绝录用，照片却被用于其他用途，涉嫌侵犯肖像权。',
  type: 'KTV诈骗',
  date: '2024-07-12',
  warning_signs: ['要求穿特殊服装拍照', '工作内容含糊不清', '工作时间异常', '试用期无工资']
}, {
  id: 25,
  title: '虚假简历优化服务骗局',
  summary: '某职业咨询公司以提供简历优化、面试辅导为名，收取每人3000-8000元服务费，提供的都是网上可免费获取的模板和建议，毫无实际价值。',
  type: '简历服务诈骗',
  date: '2024-11-20',
  warning_signs: ['收费过高', '承诺显著提高成功率', '服务内容空洞', '无成功案例证明']
}, {
  id: 26,
  title: '网络写手招聘骗局',
  summary: '写作平台招聘网络写手，要求先交保证金防止"跳单"，承诺每千字30-50元，实际稿费结算时以各种理由扣款，最终所得远低于预期。',
  type: '写手诈骗',
  date: '2025-01-25',
  warning_signs: ['收取保证金', '稿费标准不透明', '扣款理由多样', '提现门槛高']
}, {
  id: 27,
  title: '"码商"兼职洗钱陷阱',
  summary: '诈骗团伙以"码商"兼职为名，要求大学生提供收款二维码帮助转账，声称是正常业务流程，实际是帮助诈骗团伙洗钱，多名学生因此被追究法律责任。',
  type: '洗钱诈骗',
  date: '2024-12-18',
  warning_signs: ['要求提供收款码', '转账频繁金额大', '收取高额佣金', '涉嫌违法洗钱']
}, {
  id: 28,
  title: '假冒名企招聘会骗局',
  summary: '诈骗团伙冒充知名企业举办招聘会，租赁高档写字楼营造正规氛围，收取每人200元简历筛选费，现场收取费用后就解散，企业证实从未委托其招聘。',
  type: '假招聘会诈骗',
  date: '2024-09-28',
  warning_signs: ['收取筛选费', '现场气氛异常匆忙', '无法提供企业授权', '收钱后匆忙结束']
}, {
  id: 29,
  title: '社交平台兼职诈骗',
  summary: '诈骗分子在社交平台发布"点赞转发赚钱"兼职信息，要求先关注多个账号并转发内容，完成后以"系统维护"为由拒绝支付，实际利用学生账号进行营销推广。',
  type: '社交平台诈骗',
  date: '2025-02-05',
  warning_signs: ['要求关注转发', '承诺简单任务高收益', '任务完成后拖延支付', '要求提供账号密码']
}, {
  id: 30,
  title: '"AI数字人"项目诈骗',
  summary: '某科技公司以招募"AI数字人模特"为名，要求应聘者录制多角度视频和声音素材，承诺每次使用付费，实际素材被用于各种商业用途，从未支付任何费用。',
  type: '数字人诈骗',
  date: '2025-03-08',
  warning_signs: ['要求录制个人影像', '承诺使用付费', '合同条款模糊', '肖像权无保障']
}, {
  id: 31,
  title: '编制招聘骗局：假冒事业单位',
  summary: '诈骗团伙假冒某市教育局，通过伪造公文和网站，发布事业编制教师招聘信息，收取每人2-5万元"公关费"，承诺保证录用，数十名应届毕业生被骗。',
  type: '央企国企诈骗',
  date: '2024-03-15',
  warning_signs: ['无官方网站公告', '要求私下交费', '承诺保证录用', '联系方式为个人电话']
}, {
  id: 32,
  title: '国企劳务派遣诈骗',
  summary: '某劳务公司声称与多家国企合作，可安排正式工作，实际只是临时派遣工，工资待遇远低于承诺，且随时可被辞退，学生缴纳的1.5万元介绍费无法退还。',
  type: '央企国企诈骗',
  date: '2024-11-08',
  warning_signs: ['模糊劳务性质', '口头承诺转正', '收取高额介绍费', '合同条款避重就轻']
}, {
  id: 33,
  title: '"名企内推"微信群骗局',
  summary: '诈骗分子建立"互联网名企内推群"，以"内部员工"身份提供简历内推服务，收取每人5000-8000元费用，实际只是将简历投递到公开招聘邮箱。',
  type: '内推诈骗',
  date: '2025-02-18',
  warning_signs: ['微信群内推', '无法验证内部身份', '只提供电子发票', '不保证面试机会']
}, {
  id: 34,
  title: '保研推免诈骗陷阱',
  summary: '某咨询机构声称与高校研究生导师有关系，可帮助学生获得保研推免资格，收取3-10万元费用，实际无任何关系和能力，多名学生因此错过正常申请。',
  type: '内推诈骗',
  date: '2024-09-20',
  warning_signs: ['承诺保证保研', '要求巨额费用', '无法提供导师联系', '签订模糊协议']
}, {
  id: 35,
  title: 'IT技能培训贷陷阱',
  summary: '某IT培训机构承诺"零基础4个月成为高薪程序员"，诱导学生贷款2.5万元参加培训，课程质量差且就业承诺无法兑现，学生背负贷款却无法就业。',
  type: '培训贷诈骗',
  date: '2024-06-25',
  warning_signs: ['夸大就业前景', '承诺包就业', '诱导贷款', '课程质量低劣']
}, {
  id: 36,
  title: '会计证培训骗局',
  summary: '培训机构以考取会计职称证书为名，要求学生贷款1.8万元参加培训，承诺考试不过全额退款，但设置各种苛刻条件导致学生无法退款。',
  type: '培训贷诈骗',
  date: '2024-10-12',
  warning_signs: ['承诺不过退款', '退款条件苛刻', '贷款利息高', '培训效果差']
}, {
  id: 37,
  title: '"区块链创业"投资骗局',
  summary: '某公司以区块链创业项目为名，招募大学生"合伙人"，要求投资3-10万元购买虚拟货币，承诺高额回报，最终平台关闭，投资全部打水漂。',
  type: '创业诈骗',
  date: '2024-12-08',
  warning_signs: ['虚拟货币投资', '承诺暴利回报', '拉人头模式', '平台突然关闭']
}, {
  id: 38,
  title: '电商创业加盟陷阱',
  summary: '某电商平台招募校园代理，承诺"零成本创业"，实际要求学生缴纳5000元保证金和首批货款，货物滞销且无法退货，平台服务费不断增加。',
  type: '创业诈骗',
  date: '2025-01-15',
  warning_signs: ['承诺零风险', '要求囤货', '货物无销路', '平台扣费名目多']
}, {
  id: 39,
  title: '英语培训岗前诈骗',
  summary: '某教育机构招聘英语教师，要求应聘者先参加为期两周的付费培训，收取3000元培训费，培训后以"口语不达标"为由不予录用，培训费不退。',
  type: '招聘培训诈骗',
  date: '2024-07-18',
  warning_signs: ['强制参加培训', '收取培训费', '考核标准模糊', '大概率不录用']
}, {
  id: 40,
  title: '金融销售岗前骗局',
  summary: '某金融公司以招聘理财顾问为名，要求新人先考取金融资格证书，指定培训机构收取8000元费用，获证后却以"业绩不达标"为由辞退。',
  type: '招聘培训诈骗',
  date: '2024-09-30',
  warning_signs: ['要求考取证书', '指定培训机构', '收取高额费用', '试用期随意辞退']
}, {
  id: 41,
  title: '公务员考试包过骗局',
  summary: '某培训机构声称与公务员考试部门有关系，可以"包过"笔试面试，收取每人5-15万元费用，实际无任何关系，考试失败后拒绝退款。',
  type: '关系诈骗',
  date: '2024-04-10',
  warning_signs: ['承诺考试包过', '要求巨额费用', '无法提供官方证明', '失败后拒绝退款']
}, {
  id: 42,
  title: '医院编制关系诈骗',
  summary: '诈骗分子谎称某三甲医院院长亲戚，可安排护士编制岗位，收取10万元"活动费"，收钱后以各种理由拖延，最终失联。',
  type: '关系诈骗',
  date: '2024-08-22',
  warning_signs: ['声称有特殊关系', '要求巨额活动费', '无具体进展', '联系方式突然失效']
}, {
  id: 43,
  title: '"虚拟货币"传销APP',
  summary: '犯罪团伙开发"财富自由"APP，以投资虚拟货币为名，要求会员发展下线，形成金字塔结构，涉案金额超3亿元，平台关闭后投资者血本无归。',
  type: '网络传销',
  date: '2025-03-12',
  warning_signs: ['虚拟货币投资', '发展下线返利', '多级分销结构', '平台突然跑路']
}, {
  id: 44,
  title: '健康产品传销骗局',
  summary: '某公司以销售保健品为名，要求新人购买产品并发展下线，承诺层层返利，实际是传销组织，多名大学生被洗脑后拉亲友入伙，造成家庭损失。',
  type: '网络传销',
  date: '2024-10-28',
  warning_signs: ['购买产品入会', '发展人头返利', '洗脑式培训', '拉亲友入伙']
}, {
  id: 45,
  title: '寒假工中介诈骗',
  summary: '黑中介发布大量寒假工招聘信息，收取每人200-500元中介费后，提供的工作要么不存在，要么条件恶劣工资极低，中介费无法退还。',
  type: '黑中介诈骗',
  date: '2025-01-10',
  warning_signs: ['收取中介费', '工作信息虚假', '条件恶劣', '不签订合同']
}, {
  id: 46,
  title: '劳务派遣黑中介',
  summary: '某中介公司以派遣到工厂为名，收取每人1000元押金和体检费，承诺月薪6000元，实际工资仅3000元且工作环境恶劣，押金不予退还。',
  type: '黑中介诈骗',
  date: '2024-08-15',
  warning_signs: ['收取押金体检费', '工资承诺不兑现', '工作环境差', '押金不退还']
}, {
  id: 47,
  title: '迪拜高薪骗局',
  summary: '诈骗团伙以迪拜五星级酒店高薪招聘为名，收取签证费和机票费共3万元，将学生骗至迪拜后，实际工作是餐厅服务员，工资远低于承诺。',
  type: '海外务工诈骗',
  date: '2024-11-25',
  warning_signs: ['要求预付高额费用', '工作描述过于美好', '签证手续不正规', '抵达后工作大变']
}, {
  id: 48,
  title: '日本研修生陷阱',
  summary: '某中介以日本技能实习为名招聘，收取每人5万元中介费，承诺月薪2万元，实际是重体力劳动，每天工作12小时，工资仅8000元且扣除各种费用。',
  type: '海外务工诈骗',
  date: '2024-06-18',
  warning_signs: ['收取高额中介费', '承诺高薪轻松', '实际工作辛苦', '工资被大量克扣']
}, {
  id: 49,
  title: '直播公会签约陷阱',
  summary: '某传媒公司以"直播公会"名义招募主播，承诺流量扶持和保底收入，要求签5年独家合约并交2万元违约金，实际无任何流量支持，想解约需支付巨额违约金。',
  type: '主播诈骗',
  date: '2025-02-22',
  warning_signs: ['签订长期合约', '高额违约金', '无流量扶持', '保底收入不兑现']
}, {
  id: 50,
  title: '短视频达人签约骗局',
  summary: '某MCN机构以打造"短视频达人"为名，要求应聘者签约并缴纳1.5万元包装费，承诺视频播放量保证百万，实际拍摄质量差且无推广，播放量极低。',
  type: '主播诈骗',
  date: '2024-12-05',
  warning_signs: ['收取包装费', '承诺播放量', '内容质量差', '无实际推广']
}, {
  id: 51,
  title: '小说录入员骗局',
  summary: '某文化公司招聘小说录入员，声称日薪200元，要求先交600元会员费获取任务，交费后发现任务极少且要求极高，根本无法完成赚钱。',
  type: '打字员诈骗',
  date: '2024-09-15',
  warning_signs: ['日薪过高', '要求会员费', '任务稀少', '完成标准苛刻']
}, {
  id: 52,
  title: '文稿整理诈骗',
  summary: '诈骗分子以整理文稿为名招聘兼职，要求交纳800元押金防止泄密，承诺按字数结算，收到押金后提供的文稿无法打开或任务消失，押金不予退还。',
  type: '打字员诈骗',
  date: '2025-01-28',
  warning_signs: ['要求押金', '以泄密为由', '文件无法打开', '押金不退']
}, {
  id: 53,
  title: '淘宝录单员陷阱',
  summary: '某电商公司招聘订单录入员，要求先购买软件使用权1200元，承诺按单结算每单2元，购买后发现订单极少，一个月收入不足百元。',
  type: '录单员诈骗',
  date: '2024-11-03',
  warning_signs: ['要求购买软件', '承诺按单付费', '实际订单极少', '入不敷出']
}, {
  id: 54,
  title: '快递单号录入骗局',
  summary: '诈骗团伙发布快递单号录入兼职，要求交800元保证金，承诺每天录入200单，每单0.5元，交钱后发现任务系统频繁故障，根本无法完成任务。',
  type: '录单员诈骗',
  date: '2024-07-20',
  warning_signs: ['收取保证金', '系统故障频繁', '无法完成任务', '保证金不退']
}, {
  id: 55,
  title: '英雄联盟代练诈骗',
  summary: '某工作室招聘游戏代练，要求租赁培训账号交2000元押金，承诺完成订单后返还，学生完成任务后对方以"账号异常"为由扣押金，最终失联。',
  type: '游戏代练诈骗',
  date: '2024-10-15',
  warning_signs: ['租赁账号', '高额押金', '任务后扣钱', '各种理由克扣']
}, {
  id: 56,
  title: '和平精英代练陷阱',
  summary: '诈骗分子以招募游戏代练为名，要求应聘者先购买"专业设备"共1500元，承诺接单后返还，购买后发现根本没有订单，设备也是普通手机。',
  type: '游戏代练诈骗',
  date: '2025-02-08',
  warning_signs: ['要求购买设备', '承诺订单返还', '无实际订单', '设备价值低']
}, {
  id: 57,
  title: '名企暑期实习骗局',
  summary: '某咨询公司声称可安排到BAT等互联网大厂实习，收取每人4万元安排费，实际只是参观和旁听会议，无法获得正式实习证明和转正机会。',
  type: '实习诈骗',
  date: '2024-05-30',
  warning_signs: ['收取高额安排费', '实习内容名不副实', '无正式证明', '转正承诺虚假']
}, {
  id: 58,
  title: '外企实习内推陷阱',
  summary: '某留学机构以提供外企实习内推为名，收取2.5万元服务费，实际只是帮忙投递简历，能否获得实习完全靠运气，服务费不予退还。',
  type: '实习诈骗',
  date: '2024-08-12',
  warning_signs: ['高额服务费', '不保证结果', '服务内容简单', '费用不退还']
}, {
  id: 59,
  title: '保险公司员工自保骗局',
  summary: '某保险公司招聘，入职后强制要求员工购买本公司保险产品"冲业绩"，诱导贷款购买高达5万元保险，承诺可退保，实际退保损失惨重。',
  type: '保险诈骗',
  date: '2024-11-18',
  warning_signs: ['强制自购产品', '诱导贷款', '承诺可退保', '退保损失大']
}, {
  id: 60,
  title: '保险销售培训陷阱',
  summary: '保险公司以"管理培训生"名义招聘，入职后要求先考取保险代理人资格证并自购保单，否则无法转正，学生购买后发现是销售岗位，承诺的管理岗不存在。',
  type: '保险诈骗',
  date: '2024-09-08',
  warning_signs: ['岗位名称误导', '要求自购产品', '转正条件苛刻', '实际岗位不符']
}, {
  id: 61,
  title: '社交电商代理骗局',
  summary: '某社交电商平台招募校园代理，要求首批进货5000元，承诺"躺赚模式"，实际产品质量差无人购买，货物无法退换，学生血本无归。',
  type: '微商诈骗',
  date: '2025-03-01',
  warning_signs: ['要求大额进货', '产品质量差', '无法退换货', '无销售渠道']
}, {
  id: 62,
  title: '面膜代理层级骗局',
  summary: '某美妆公司以招募代理为名，设置多个代理级别，最低级需囤货3000元，承诺发展下线有返利，实际是传销模式，上级代理赚取下级差价。',
  type: '微商诈骗',
  date: '2024-12-15',
  warning_signs: ['多层级代理', '发展下线返利', '囤货模式', '传销性质']
}, {
  id: 63,
  title: '拼多多客服岗前培训骗局',
  summary: '某外包公司招聘电商客服，要求参加3天岗前培训收费1500元，培训后以"考核不合格"为由不予录用，考核标准极其苛刻，通过率不足10%。',
  type: '客服培训诈骗',
  date: '2024-08-08',
  warning_signs: ['强制岗前培训', '收取培训费', '考核通过率极低', '费用不退还']
}, {
  id: 64,
  title: '400电话客服陷阱',
  summary: '某呼叫中心招聘客服，要求先参加话术培训交2000元，承诺培训后底薪4000元加提成，实际培训内容简单，上岗后发现是骚扰电话销售，收入极低。',
  type: '客服培训诈骗',
  date: '2024-10-22',
  warning_signs: ['收取话术培训费', '实际工作不符', '收入远低承诺', '工作性质恶劣']
}, {
  id: 65,
  title: '一对一家教信息费陷阱',
  summary: '某家教中心收取500元信息费，承诺提供至少3个家教机会，实际提供的家长联系方式都是无效的或已找到老师的，中介拒绝退费。',
  type: '家教中介诈骗',
  date: '2024-09-18',
  warning_signs: ['收取高额信息费', '联系方式无效', '家长已找到老师', '拒绝退费']
}, {
  id: 66,
  title: '在线教育兼职骗局',
  summary: '某在线教育平台招聘兼职老师，要求先交1000元平台入驻费获取学生资源，入驻后发现学生极少，一个月接不到几单，入驻费无法退还。',
  type: '家教中介诈骗',
  date: '2025-01-12',
  warning_signs: ['收取入驻费', '学生资源稀少', '收入极低', '费用不退']
}, {
  id: 67,
  title: '横店群演档案费骗局',
  summary: '某影视公司以招聘横店群众演员为名，收取每人800元建档费和服装费，承诺每月至少10次拍摄机会，实际一个月仅安排1-2次，且车费餐费自理。',
  type: '群演诈骗',
  date: '2024-07-05',
  warning_signs: ['收取建档费', '拍摄机会稀少', '各种费用自理', '片酬极低']
}, {
  id: 68,
  title: '微电影演员签约陷阱',
  summary: '某传媒公司招募微电影演员，要求签约并交2万元包装费，承诺拍摄3部微电影，实际只拍摄了一部质量低劣的网络短片，且未支付任何报酬。',
  type: '群演诈骗',
  date: '2024-11-20',
  warning_signs: ['收取包装费', '作品质量差', '不支付报酬', '合约陷阱多']
}, {
  id: 69,
  title: '淘宝刷好评返现骗局',
  summary: '诈骗分子以淘宝刷好评为名，要求先购买商品再返现加佣金，第一单返现正常，第二单以"系统延迟"为由不返现，客服失联，商品也是劣质品。',
  type: '刷评论诈骗',
  date: '2024-12-28',
  warning_signs: ['要求先垫付', '第一单正常返现', '后续系统故障', '客服失联']
}, {
  id: 70,
  title: '美团点评员骗局',
  summary: '某公司招聘美团点评员，要求先在指定餐厅消费并好评，承诺餐费加佣金双倍返还，消费后发现返现一直不到账，联系客服被拉黑。',
  type: '刷评论诈骗',
  date: '2025-02-15',
  warning_signs: ['要求先消费', '承诺双倍返还', '返现不到账', '客服拉黑']
}, {
  id: 71,
  title: '夜总会服务员陷阱',
  summary: '某KTV以招聘服务员为名，面试时要求女生试穿暴露服装拍照，以"形象审核"为由留存照片，随后以各种理由不予录用，照片却被用于不当用途。',
  type: 'KTV诈骗',
  date: '2024-08-25',
  warning_signs: ['要求穿暴露服装', '拍照留存', '审核理由牵强', '照片用途不明']
}, {
  id: 72,
  title: '酒吧公关招聘骗局',
  summary: '某娱乐场所招聘"商务公关"，面试时要求交1000元服装费和培训费，实际工作内容是陪酒，工作环境恶劣且存在人身安全风险，服装费不予退还。',
  type: 'KTV诈骗',
  date: '2024-10-10',
  warning_signs: ['工作描述模糊', '收取服装费', '实际工作不正当', '人身安全风险']
}, {
  id: 73,
  title: '求职资料包骗局',
  summary: '某职业规划公司以提供"名企求职资料包"为名，收取每人5000元，实际提供的都是网上免费资源的整合，毫无价值，且不支持退款。',
  type: '简历服务诈骗',
  date: '2024-11-28',
  warning_signs: ['收费过高', '内容毫无价值', '都是免费资源', '不支持退款']
}, {
  id: 74,
  title: '职业测评陷阱',
  summary: '某机构以职业测评和规划为名，收取3000元服务费，测评后提供一份模板化的报告，建议内容空泛无用，对求职毫无帮助。',
  type: '简历服务诈骗',
  date: '2025-01-20',
  warning_signs: ['测评收费高', '报告模板化', '建议空泛', '无实际帮助']
}, {
  id: 75,
  title: '自媒体写作陷阱',
  summary: '某自媒体平台招募写手，要求先交1000元培训费学习写作技巧，培训后以"文章质量不达标"为由拒绝发布，培训费不予退还。',
  type: '写手诈骗',
  date: '2024-09-28',
  warning_signs: ['收取培训费', '质量标准不明', '文章不予发布', '费用不退还']
}, {
  id: 76,
  title: '公众号投稿骗局',
  summary: '诈骗分子伪造知名公众号招募投稿作者，要求交800元"入驻费"获得投稿资格，交费后发现公众号是假的，对方已失联。',
  type: '写手诈骗',
  date: '2025-02-28',
  warning_signs: ['收取入驻费', '公众号认证存疑', '无法验证真实性', '交费后失联']
}, {
  id: 77,
  title: 'USDT跑分陷阱',
  summary: '诈骗团伙以"虚拟币跑分"兼职为名，要求提供USDT钱包地址帮助转账，实际是帮诈骗团伙洗钱，多名学生因此被公安机关立案调查。',
  type: '洗钱诈骗',
  date: '2024-12-10',
  warning_signs: ['虚拟币转账', '佣金异常高', '资金来源不明', '涉嫌洗钱犯罪']
}, {
  id: 78,
  title: '游戏充值代理洗钱案',
  summary: '诈骗分子以招募游戏充值代理为名，要求提供微信收款码，帮助他人充值游戏币赚取佣金，实际是洗钱通道，学生账户被冻结且面临法律风险。',
  type: '洗钱诈骗',
  date: '2025-01-05',
  warning_signs: ['要求提供收款码', '频繁大额转账', '佣金回报高', '账户被冻结风险']
}, {
  id: 79,
  title: '线下双选会收费骗局',
  summary: '诈骗团伙租赁场地举办"名企双选会"，收取每家企业展位费和学生入场费各200元，现场企业多为皮包公司，根本不招人，下午就撤场跑路。',
  type: '假招聘会诈骗',
  date: '2024-10-05',
  warning_signs: ['收取入场费', '企业质量差', '下午提前撤场', '组织者失联']
}, {
  id: 80,
  title: '高端猎头见面会陷阱',
  summary: '某猎头公司举办"高端人才见面会"，收取每人500元VIP门票，承诺现场直接面试名企高管，实际现场混乱且无正式面试环节，所谓高管都是托儿。',
  type: '假招聘会诈骗',
  date: '2024-11-15',
  warning_signs: ['收取高额门票', '无正式面试', '高管身份存疑', '现场混乱']
}, {
  id: 81,
  title: '抖音点赞关注骗局',
  summary: '诈骗分子在抖音评论区招募"点赞员"，要求关注多个账号并点赞视频，承诺每个账号5元，完成后以"账号异常"为由不支付，浪费学生大量时间。',
  type: '社交平台诈骗',
  date: '2025-03-05',
  warning_signs: ['任务简单报酬高', '要求关注点赞', '以异常为由不付', '浪费时间']
}, {
  id: 82,
  title: '小红书推广引流陷阱',
  summary: '某MCN机构以招募小红书推广员为名，要求先购买推广商品自己发笔记，承诺笔记爆了返还商品款加佣金，购买后发现根本没流量，无法爆款。',
  type: '社交平台诈骗',
  date: '2024-12-20',
  warning_signs: ['要求自购商品', '承诺爆款返款', '无流量支持', '商品款打水漂']
}, {
  id: 83,
  title: '虚拟偶像声音采集陷阱',
  summary: '某科技公司以"虚拟偶像声音库建设"为名，要求应聘者录制大量音频素材，承诺每次使用支付版权费，实际素材被无限制使用，从未支付任何费用。',
  type: '数字人诈骗',
  date: '2025-02-18',
  warning_signs: ['免费采集素材', '承诺使用付费', '合同条款有利对方', '从未实际支付']
}, {
  id: 84,
  title: 'AI换脸模特骗局',
  summary: '某广告公司招募"AI换脸模特"，要求拍摄面部特写和全身照片，承诺每次使用支付300元，实际照片被用于各种场景，从未获得任何报酬且无法维权。',
  type: '数字人诈骗',
  date: '2024-10-30',
  warning_signs: ['采集面部数据', '合同不规范', '使用无通知', '无法获得报酬']
}];
const CaseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  // Filter types extracted from cases
  const caseTypes = ['全部', ...Array.from(new Set(realCases.map(c => c.type)))];
  // Filter cases based on search term and type
  const filteredCases = realCases.filter(c => {
    const matchesSearch = c.title.includes(searchTerm) || c.summary.includes(searchTerm) || c.warning_signs.some(sign => sign.includes(searchTerm));
    const matchesType = filterType === '全部' || c.type === filterType;
    return matchesSearch && matchesType;
  });
  return <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen w-full transition-colors duration-300">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative">
        {/* Neumorphic Header Card */}
        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-[20px_20px_60px_rgba(0,0,0,0.05),-20px_-20px_60px_rgba(255,255,255,0.8)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.4),-20px_-20px_60px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-700 mb-16 transform transition-all duration-300 hover:shadow-[15px_15px_30px_rgba(0,0,0,0.06),-15px_-15px_30px_rgba(255,255,255,0.9)] dark:hover:shadow-[15px_15px_30px_rgba(0,0,0,0.5),-15px_-15px_30px_rgba(255,255,255,0.03)]">
          {/* Floating 3D Shield Icon */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="relative w-20 h-20 transition-transform duration-300 hover:rotate-6 group">
              {/* Shadow layers for 3D effect */}
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-10 blur-md transform scale-90 translate-y-1"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-lg transform scale-95"></div>
              {/* Icon container with neumorphic effect */}
              <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.02)] flex items-center justify-center border border-gray-100 dark:border-gray-600 group-hover:shadow-[3px_3px_10px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)] dark:group-hover:shadow-[3px_3px_10px_rgba(0,0,0,0.5),-3px_-3px_10px_rgba(255,255,255,0.03)] transition-all duration-300">
                <ShieldCheckIcon className="h-10 w-10 text-blue-600 dark:text-blue-400 transform transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
          </div>
          <div className="text-center pt-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4 text-shadow">
              求职诈骗案例库
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              了解真实的求职诈骗案例，提高警惕，保护自己的权益
            </p>
          </div>
          {/* Search and Filter with inner shadow */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-600">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow group">
                  {/* Neumorphic search input */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" aria-hidden="true" />
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 sm:text-sm shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]" placeholder="搜索案例关键词..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative inline-block min-w-[180px] group">
                  <div className="flex items-center">
                    <FilterIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" aria-hidden="true" />
                    <select className="block w-full pl-3 pr-10 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]" value={filterType} onChange={e => setFilterType(e.target.value)}>
                      {caseTypes.map(type => <option key={type} value={type}>
                          {type}
                        </option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Case List */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {filteredCases.map(caseItem => <div key={caseItem.id} className="bg-white dark:bg-gray-800 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {caseItem.title}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {caseItem.type}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{caseItem.date}</p>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{caseItem.summary}</p>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <AlertCircleIcon className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      预警信号:
                    </h4>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {caseItem.warning_signs.map((sign, index) => <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-block w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {sign}
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>)}
        </div>
        {filteredCases.length === 0 && <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
              <SearchIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              未找到匹配的案例，请尝试其他搜索条件
            </p>
          </div>}
        <div className="mt-16 text-center"></div>
      </div>
    </div>;
};
export default CaseLibrary;