package com.example.demo.service;

import com.example.demo.entity.Topic;
import com.example.demo.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    public Topic createTopic(String name) {
        if (topicRepository.existsByName(name)) {
            throw new RuntimeException("Topic already exists: " + name);
        }
        Topic topic = new Topic(name);
        return topicRepository.save(topic);
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
    }

    public Topic updateTopic(Long id, String newName) {
        Topic topic = getTopicById(id);
        
        // Check if new name already exists
        if (!topic.getName().equals(newName) && topicRepository.existsByName(newName)) {
            throw new RuntimeException("Topic already exists: " + newName);
        }
        
        topic.setName(newName);
        return topicRepository.save(topic);
    }

    public void deleteTopic(Long id) {
        Topic topic = getTopicById(id);
        topicRepository.delete(topic);
    }
}
