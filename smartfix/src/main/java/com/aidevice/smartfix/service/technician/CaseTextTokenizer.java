package com.aidevice.smartfix.service.technician;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

final class CaseTextTokenizer {

    private static final Pattern NON_WORD = Pattern.compile("[^a-z0-9\\s]");
    private static final Set<String> STOPWORDS = Set.of(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
            "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had", "do", "does",
            "did", "not", "no", "yes", "it", "its", "this", "that", "these", "those", "device", "phone",
            "laptop", "computer", "customer", "repair", "issue", "problem", "when", "after", "before",
            "very", "also", "just", "into", "out", "up", "down", "over", "under", "again", "then", "once"
    );

    private CaseTextTokenizer() {}

    static List<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }
        String normalized = NON_WORD.matcher(text.toLowerCase(Locale.ROOT)).replaceAll(" ");
        String[] split = normalized.split("\\s+");
        List<String> out = new ArrayList<>();
        for (String s : split) {
            if (s.length() < 2) continue;
            if (STOPWORDS.contains(s)) continue;
            out.add(s);
        }
        return out;
    }

    static Set<String> tokenSet(String text) {
        return new HashSet<>(tokenize(text));
    }

    static String joinCorpus(String... parts) {
        return Arrays.stream(parts)
                .filter(Objects::nonNull)
                .collect(Collectors.joining(" "));
    }
}
