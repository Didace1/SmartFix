package com.aidevice.smartfix.service.technician;

import com.aidevice.smartfix.model.RepairCase;

import java.util.Locale;

/**
 * Shared text keys for historical case aggregation (fault / action grouping).
 */
public final class RepairCaseSummaries {

    private RepairCaseSummaries() {}

    public static String diagnosisKey(RepairCase c) {
        if (c.getFinalFaultCode() != null && !c.getFinalFaultCode().isBlank()) {
            return c.getFinalFaultCode().trim();
        }
        String d = c.getDiagnosisText();
        if (d == null || d.isBlank()) {
            return "Unspecified diagnosis";
        }
        String t = d.trim().replaceAll("\\s+", " ");
        return t.length() > 140 ? t.substring(0, 140) : t;
    }

    public static String summarizeAction(RepairCase c) {
        String s = c.getSolutionSummary();
        if (s != null && !s.isBlank()) {
            String t = s.trim().replaceAll("\\s+", " ");
            return t.length() > 160 ? t.substring(0, 160) : t;
        }
        if (c.getDiagnosisText() != null && !c.getDiagnosisText().isBlank()) {
            return "Address: " + diagnosisKey(c);
        }
        return "See diagnosis notes";
    }

    public static String symptomCorpus(RepairCase c) {
        return CaseTextTokenizer.joinCorpus(
                c.getSymptomsText(),
                c.getInspectionNotes(),
                c.getDiagnosisText(),
                c.getTechnicianNotes());
    }

    public static boolean containsAnyIgnoreCase(String hay, String... needles) {
        if (hay == null) return false;
        String h = hay.toLowerCase(Locale.ROOT);
        for (String n : needles) {
            if (n != null && h.contains(n.toLowerCase(Locale.ROOT))) return true;
        }
        return false;
    }
}
