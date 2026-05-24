package com.aidevice.smartfix.service.technician;

import java.util.*;

/**
 * In-memory TF-IDF + cosine similarity over a small candidate set (Phase 2 style, no external APIs).
 */
final class TfidfCosineSimilarity {

    private TfidfCosineSimilarity() {}

    static Map<String, Double> idf(List<List<String>> documents) {
        int n = Math.max(1, documents.size());
        Map<String, Integer> docFreq = new HashMap<>();
        for (List<String> doc : documents) {
            Set<String> unique = new HashSet<>(doc);
            for (String t : unique) {
                docFreq.merge(t, 1, Integer::sum);
            }
        }
        Map<String, Double> idf = new HashMap<>();
        for (Map.Entry<String, Integer> e : docFreq.entrySet()) {
            idf.put(e.getKey(), Math.log((1.0 + n) / (1.0 + e.getValue())) + 1.0);
        }
        return idf;
    }

    static Map<String, Double> tfidfVector(List<String> tokens, Map<String, Double> idf) {
        Map<String, Integer> tf = new HashMap<>();
        for (String t : tokens) {
            tf.merge(t, 1, Integer::sum);
        }
        Map<String, Double> vec = new HashMap<>();
        for (Map.Entry<String, Integer> e : tf.entrySet()) {
            Double idfVal = idf.get(e.getKey());
            if (idfVal == null) continue;
            vec.put(e.getKey(), (1.0 + Math.log(e.getValue())) * idfVal);
        }
        return vec;
    }

    static double cosine(Map<String, Double> a, Map<String, Double> b) {
        if (a.isEmpty() || b.isEmpty()) return 0.0;
        double dot = 0.0;
        Map<String, Double> small = a.size() <= b.size() ? a : b;
        Map<String, Double> large = a.size() <= b.size() ? b : a;
        for (Map.Entry<String, Double> e : small.entrySet()) {
            Double other = large.get(e.getKey());
            if (other != null) dot += e.getValue() * other;
        }
        double na = norm(a);
        double nb = norm(b);
        if (na == 0 || nb == 0) return 0.0;
        return dot / (na * nb);
    }

    private static double norm(Map<String, Double> v) {
        double s = 0.0;
        for (double x : v.values()) s += x * x;
        return Math.sqrt(s);
    }
}
