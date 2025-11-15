// src/services/api.js
import axios from 'axios';

// Cấu hình URL cơ sở của Spring Boot
const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// === MODULE 1 API (Đã có) ===

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
export const submitQuizResults = (results) => {
    return API.post('/quiz/submit', results);
};

// --- Module 3: Review APIs ---
export const countLearned = (userId = 2) => {
    return API.get(`/users/${userId}/vocabularies/learned/count`);
// === MODULE 2 API (MỚI) ===

/**
 * API 1: Lấy tất cả các kịch bản (tình huống)
 */
export const getAllScenarios = () => {
    return API.get('/scenarios');
};

/**
 * API 2: Lấy bộ Prep-Kit (Flashcards) cho một kịch bản
 */
export const getPrepKit = (scenarioId) => {
    return API.get(`/scenarios/${scenarioId}/prep-kit`);
export const getAllLearned = (userId = 2) => {
    return API.get(`/users/${userId}/vocabularies/learned`);
};

/**
 * API 3: Lấy video/node bắt đầu của một kịch bản
 */
export const getStartingPracticeNode = (scenarioId) => {
    return API.get(`/scenarios/${scenarioId}/start`);
};

/**
 * API 4: Lấy video/node tiếp theo dựa trên lựa chọn
 */
export const getNextNode = (choiceId) => {
    return API.get(`/scenarios/choice/${choiceId}`);
export const getLearnedWithLimit = (userId = 2, limit = 3) => {
    return API.get(`/users/${userId}/vocabularies/learned?limit=${limit}`);
};