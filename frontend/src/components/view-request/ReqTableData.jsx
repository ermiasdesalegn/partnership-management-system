import Table from "./Table";
import requestService from "../../services/request-service";
import { useEffect, useState } from "react";  

const ReqTableData = () => {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Company Name",
    "Company Type",
    "Partnership Type",
    "Actions",
  ];

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    requestService.getAll()
    .then((res) => setRequests(res.data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
  },[])

  if (loading) return <h2> Loading...</h2>

  if (error) return <h2> {error || "Something went wrong"} </h2>
  
  console.log(requests[0] )

  return (
    <div className="w-full min-h-screen">
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Requests</h1>
        <Table headers={headers} rows={requests} />
      </div>
    </div>
  );
};

export default ReqTableData;