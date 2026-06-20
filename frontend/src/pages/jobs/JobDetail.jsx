import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import JobDetailPane from "../../components/jobs/JobDetailPane";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-[1000px] mx-auto h-[85vh] relative">
        <button 
          onClick={() => navigate("/jobs")}
          className="absolute -top-12 left-0 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft size={20} /> Back to Jobs
        </button>
        <JobDetailPane jobId={id} />
      </div>
    </div>
  );
};

export default JobDetail;
