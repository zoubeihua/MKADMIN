function supplementPath(menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}
export const menuData = supplementPath([{
  path: 'memberadmin',
  title: '会员管理',
  icon: 'vimeo',
  children: [
    { path: `baseinfo`,title: '基本信息',icon: '' },
    {
      path: `membershipinterests`,
      title: '会员权益',
      icon: ''
    },
    {
      path: `memberpayment`,
      title: '会员缴费',
      icon: ''
    },
  ]
},{
  path: 'health',
  title: '健康档案',
  icon: 'heartbeat',
  children: [
    { path: `visitrecords`,title: '就诊记录',icon: 'plug' },
    {
      path: `questioneva`,
      title: '问卷评估',
      icon: ''
    },
    {
      path: `phyeva`,
      title: '体检评估',
      icon: ''
    },{
      path: `healthpro`,
      title: '健康方案',
      icon: ''
    }
  ]
},{
  path: 'membersrv',
  title: '会员服务',
  icon: 'credit-card-alt',
  children: [
    { path: `srvrecord`,title: '服务记录',icon: '' },
    {
      path: `proforce`,
      title: '方案实施',
      icon: ''
    }
  ]
}])
