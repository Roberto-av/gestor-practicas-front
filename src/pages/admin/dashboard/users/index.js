import Table from "../../../../components/admin/dashboard/table";

const Users = () => {
  const title = "Usuarios";
  const subtitle = "Gestionar a los estudiantes con usuario";
  const rows = [
    { id: 1, name: "John Doe", age: 30, phone: "123-456-7890", email: "john@example.com" },
  ];
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ];

  return (
    <div>
      <Table title={title} subtitle={subtitle} rows={rows} columns={columns} />
    </div>
  );
};

export default Users;
