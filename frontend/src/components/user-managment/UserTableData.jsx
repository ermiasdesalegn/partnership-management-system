// import RegisteredUsers from "./RegisteredUsers";
// import Table from "./Table";
// import  Requests  from "./Requests";
// const UserTableData = () => {
//   const headers = ["Name", "Role", "Status", "Joined Date"];
//   const rows = [
//     ["Abreham Nuradis", "Administrator(PMS)", "Active", "2023-05-10"],
//     ["Ammar Adnew", "Manager", "Inactive", "2022-09-15"],
//     ["Esubale Endale", "Partner", "Active", "2021-11-21"],
//     ["Habtamu Zenebe", "Collaborator", "Active", "2023-01-30"],
//     ["Grum Tamirat", "CEO(ICTYE-NETWORK)", "Active", "2023-08-14"],
//   ];

//   return (
//     <div className="w-full py-1 px-3">
//       <h1 className="text-2xl font-bold mb-4">Partnership Management Table</h1>
//       <Table headers={headers} rows={rows} />
//       <RegisteredUsers/>
//       {/* <Requests/> */}
//     </div>
//   );
// };

// export default UserTableData;






import RegisteredUsers from "./RegisteredUsers";
// import Table from "./Table";
// import  Requests  from "./Requests";
const UserTableData = () => {
 

  return (
    <div className="w-full py-1 px-3">
      
      <RegisteredUsers/>
      {/* <Requests/> */}
    </div>
  );
};

export default UserTableData;
