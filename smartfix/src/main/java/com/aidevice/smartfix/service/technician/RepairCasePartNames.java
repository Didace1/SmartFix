package com.aidevice.smartfix.service.technician;

public final class RepairCasePartNames {

    private RepairCasePartNames() {}

    public static String normalize(String name) {
        if (name == null) return "";
        return name.trim();
    }
}
