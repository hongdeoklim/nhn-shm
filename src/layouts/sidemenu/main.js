/*
{
  url: string -- 이동하려는 주소('/project/1') 또는 라우터 이름({name:'', params:{id:1}})
}
*/
export default [
  {
    url: { name: "project-home", params: { proj_id: 1 } },
    name: "안전·보건 지원실",
    icon: "ActivityIcon",
    activeCode: "",
    project_type: "총괄관리",
  },
  {
    url: { name: "project-home", params: { proj_id: 2 } },
    name: "내부종사자(직접수행)",
    icon: "UsersIcon",
    activeCode: "",
    project_type: "내부종사자",
  },
  {
    url: { name: "project-home", params: { proj_id: 3 } },
    name: "중대산업재해(용역·위탁)",
    icon: "UsersIcon",
    activeCode: "",
    project_type: "용역위탁",
  },
  {
    url: { name: "project-home", params: { proj_id: 4 } },
    name: "신축공사현장",
    icon: "HomeIcon",
    activeCode: "",
    project_type: "도급",
  },
  {
    url: { name: "project-home", params: { proj_id: 5 } },
    name: "중대시민재해",
    icon: "ShieldIcon",
    activeCode: "",
    project_type: "중대시민재해",
  },
  {
    url: { name: "project-home", params: { proj_id: 7 } },
    name: "소규모 현장",
    icon: "UsersIcon",
    activeCode: "",
    project_type: "소규모 사업장",
  },
];
