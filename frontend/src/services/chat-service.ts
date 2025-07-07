import api from "@/services/api";

const chatService = {
  sendMessage: async (body:{user_id: number, query: string}) => {
    const response = await api.post("/chat", body);
    return response.data;
  },
  getMessages: async (name: string) => {
    const response = await api.get(`/greet/${name}`);
    return response.data;
  },
};

export default chatService;
