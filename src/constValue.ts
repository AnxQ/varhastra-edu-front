const constValue = {
  userRole: ["管理员", "教师", "学生", "游客"],
  userState: ["就绪", "待验证", "已封禁"],
  coursePrivilege: ["学生", "教师", "助教"],
  courseState: [
    { text: "即将开课", color: "blue", icon: "hourglass_empty"},
    { text: "开放中", color: "green", icon: "check_circle_outline"},
    { text: "考核中", color: "orange", icon: "assignment"},
    { text: "已结束", color: "grey", icon: "schedule"},
  ]
};

export default constValue;
