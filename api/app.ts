/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import jobDescriptionRoutes from './routes/jobDescription.js'
import resumeRoutes from './routes/resume.js'
import interviewQuestionsRoutes from './routes/interviewQuestions.js'
import interviewEvaluationRoutes from './routes/interviewEvaluation.js'
import hiringDecisionRoutes from './routes/hiringDecision.js'
import biasRoutes from './routes/bias.js'
import talentProfileRoutes from './routes/talentProfile.js'
import salaryRoutes from './routes/salary.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/job-description', jobDescriptionRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/interview-questions', interviewQuestionsRoutes)
app.use('/api/interview-evaluation', interviewEvaluationRoutes)
app.use('/api/hiring-decision', hiringDecisionRoutes)
app.use('/api/bias', biasRoutes)
app.use('/api/talent-profiles', talentProfileRoutes)
app.use('/api/salary', salaryRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
