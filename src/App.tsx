import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import JobDescription from "./pages/JobDescription";
import ResumeScreening from "./pages/ResumeScreening";
import InterviewQuestions from "./pages/InterviewQuestions";
import InterviewEvaluation from "./pages/InterviewEvaluation";
import HiringDecision from "./pages/HiringDecision";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job-description" element={<JobDescription />} />
          <Route path="/resume-screening" element={<ResumeScreening />} />
          <Route path="/interview-questions" element={<InterviewQuestions />} />
          <Route path="/interview-evaluation" element={<InterviewEvaluation />} />
          <Route path="/hiring-decision" element={<HiringDecision />} />
        </Routes>
      </Layout>
    </Router>
  );
}
