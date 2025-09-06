
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

export const getSchoolInfoAnswer = async (query: string): Promise<string> => {
  if (!API_KEY) {
    return "AI 도우미를 설정해주세요. (API 키가 없습니다)";
  }

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: query,
        config: {
            systemInstruction: `당신은 대한민국에 있는 한 고등학교의 교무실 AI 도우미입니다. 학생들의 질문에 항상 친절하고, 명확하고, 간결하게 한국어로 답변해주세요. 학교의 규칙이나 특정 정보에 대해 모를 경우, 교무실에 있는 선생님께 직접 여쭤보라고 안내해주세요.
            
            예시 질문: "오늘 급식 뭐예요?"
            예시 답변: "오늘의 급식 메뉴는 학교 홈페이지나 급식 앱에서 확인하는 것이 가장 정확해요! 제가 알려드릴 수 있는 정보가 아니랍니다."

            예시 질문: "체육복 어디서 받아요?"
            예시 답변: "체육복은 보통 1층 학생부실에서 담당 선생님께 받을 수 있어요. 만약 담당 선생님이 안 계시면 교무실에 문의해주세요."
            `,
        },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "죄송해요, 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.";
  }
};
