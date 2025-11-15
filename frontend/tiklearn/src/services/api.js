import axios from 'axios';

// Cấu hình URL cơ sở của Spring Boot
const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

/**
 * Lấy danh sách tất cả chủ đề
 */
export const getTopics = () => {
    return API.get('/topics');
};

/**
 * Lấy một lô từ vựng dựa trên topicId
 */
export const getLearningBatch = (topicId) => {
    // Giả sử lấy 10 từ
    return API.get(`/learn/${topicId}?limit=10`);
};

/**
 * Nộp kết quả Quiz
 * @param {Array<Object>} results - Ví dụ: [{ vocabularyId: 1, isCorrect: true }, ...]
 */
export const submitQuizResults = (results, userId = 2) => {
    // send userId as query param so backend can use correct user (testing)
    return API.post(`/quiz/submit?userId=${userId}`, results);
};

// --- Module 3: Review APIs ---
export const countLearned = (userId = 2) => {
    return API.get(`/users/${userId}/vocabularies/learned/count`);
};

export const getAllLearned = (userId = 2) => {
    return API.get(`/users/${userId}/vocabularies/learned`);
};

export const getLearnedWithLimit = (userId = 2, limit = 3) => {
    return API.get(`/users/${userId}/vocabularies/learned?limit=${limit}`);
};