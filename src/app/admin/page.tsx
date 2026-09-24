import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Alert from "@mui/material/Alert";

const STEPS = ["Create", "Validate", "Fact-check", "Review", "Publish"];

export default function AdminPage() {
  return (
    <>
      <Typography variant="h4" component="h1">
        Admin — Content pipeline
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        AI drafts never go public without review. Use the <code>x-admin-token</code> header
        for <code>/api/admin/*</code>.
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stepper activeStep={3} alternativeLabel>
            {STEPS.map((s) => (
              <Step key={s}>
                <StepLabel>{s}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
      <Alert severity="info">
        Prisma models ready: Puzzle, GuessStockPuzzle, WordSearchPuzzle, CrosswordPuzzle,
        Company, CompanyMetric. Run <code>docker compose up -d &amp;&amp; npx prisma db push</code> to
        go live with Postgres.
      </Alert>
    </>
  );
}
