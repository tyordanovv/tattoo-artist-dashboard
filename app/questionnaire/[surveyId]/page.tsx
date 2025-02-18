import Questionnaire from "@/components/questionnaire/Questionnaire"

export default function QuestionnairePage({ params }: { params: { surveyId: string } }) {
  return (
    <main>
      <Questionnaire surveyId={params.surveyId}/>
    </main>
  )
}