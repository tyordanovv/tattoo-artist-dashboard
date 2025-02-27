import Footer from "@/components/Footer"
import Questionnaire from "@/components/questionnaire/Questionnaire"

export default function QuestionnairePage({ params }: { params: { surveyId: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main>
        <Questionnaire surveyId={params.surveyId}/>
      </main>
      <Footer/>
    </div>
  )
}