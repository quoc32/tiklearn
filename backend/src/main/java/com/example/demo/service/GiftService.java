package com.example.demo.service;

import com.example.demo.entity.Gift;
import com.example.demo.repository.GiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GiftService {

    @Autowired
    private GiftRepository giftRepository;

    public List<Gift> findAll() {
        return giftRepository.findAll();
    }

    public Optional<Gift> findById(Long id) {
        return giftRepository.findById(id);
    }

    public Gift create(Gift gift) {
        return giftRepository.save(gift);
    }

    public Gift update(Long id, Gift payload) {
        return giftRepository.findById(id).map(g -> {
            g.setName(payload.getName());
            g.setCost(payload.getCost());
            g.setSrc(payload.getSrc());
            g.setQuantity(payload.getQuantity());
            return giftRepository.save(g);
        }).orElse(null);
    }

    public void delete(Long id) {
        giftRepository.deleteById(id);
    }
}
