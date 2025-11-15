CREATE DATABASE tiklearn;
USE tiklearn;

-- =======================
-- BẢNG USERS: Lưu tài khoản (admin + learner)
-- =======================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'learner') DEFAULT 'learner',
    reward_points INT DEFAULT 0,  
    avatar_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =======================
-- BẢNG VOCABULARY: Lưu từ vựng + nghĩa + ví dụ
-- =======================
CREATE TABLE vocabulary (
    vocab_id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    word_type VARCHAR(20),
    meaning_vi VARCHAR(255),
    example_vi TEXT,
    topic VARCHAR(100),         -- chủ đề: soccer, food, daily life...
    image_url VARCHAR(500),
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- =======================
-- BẢNG VIDEOS: Video AI tạo cho mỗi từ vựng
-- =======================
CREATE TABLE videos (
    video_id INT AUTO_INCREMENT PRIMARY KEY,
    vocab_id INT,
    video_url VARCHAR(500) NOT NULL,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(vocab_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- =======================
-- BẢNG USER_VOCAB_STATUS: Theo dõi trạng thái học từ của từng người
-- =======================
CREATE TABLE user_vocab_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vocab_id INT NOT NULL,
    status ENUM('not_learned', 'learning', 'learned') DEFAULT 'not_learned',	
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    UNIQUE (user_id, vocab_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(vocab_id)
);

-- =======================
-- BẢNG QUIZ_HISTORY: Lịch sử trả lời quiz của người dùng
-- =======================
CREATE TABLE quiz_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vocab_id INT,
    question TEXT NOT NULL,
    selected_option VARCHAR(50),
    correct_option VARCHAR(50),
    is_correct BOOLEAN,
    reward_points INT DEFAULT 0,
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(vocab_id)
);


-- =======================
-- BẢNG PRONUNCIATION_SCORE: Điểm phát âm của người dùng (AI chấm)
-- =======================
CREATE TABLE pronunciation_score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vocab_id INT,
    score INT,                       -- % chính xác AI chấm
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(vocab_id)
);

CREATE TABLE user_scenario_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,           -- người dùng
    vocab_id INT,                   -- từ vựng liên quan (nếu cần)
    video_url VARCHAR(500),         -- video chứa tình huống
    is_correct BOOLEAN,             -- đúng/sai
    reward_points INT DEFAULT 0,    -- điểm thưởng nếu trả lời đúng
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(vocab_id)
);



-- =======================
-- BẢNG REWARDS: Danh sách quà tặng admin đưa vào
-- =======================
CREATE TABLE rewards (
    reward_id INT AUTO_INCREMENT PRIMARY KEY,
    reward_name VARCHAR(255),
    description TEXT,
    cost INT,  -- số điểm cần
    image_url VARCHAR(500), 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =======================
-- BẢNG REWARD_REDEEM: Lịch sử đổi quà của người dùng
-- =======================
CREATE TABLE reward_redeem (
    redeem_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reward_id INT,
    redeem_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reward_id) REFERENCES rewards(reward_id)
);
