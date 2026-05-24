package com.aidevice.smartfix.service.technician;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class RepairAnalyticsQueryRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public long countCompletedRepairs() {
        Object r = entityManager
                .createNativeQuery(
                        "SELECT COUNT(*) FROM repair_cases WHERE LOWER(repair_status) = 'completed'")
                .getSingleResult();
        if (r instanceof Number n) {
            return n.longValue();
        }
        return 0L;
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> topFaultLabels(int limit) {
        Query q = entityManager.createNativeQuery(
                """
                        SELECT fault_key, cnt
                        FROM (
                                 SELECT TRIM(COALESCE(NULLIF(final_fault_code, ''),
                                                     LEFT(COALESCE(diagnosis_text, ''), 120))) AS fault_key,
                                        COUNT(*) AS cnt
                                 FROM repair_cases
                                 WHERE LOWER(repair_status) = 'completed'
                                 GROUP BY TRIM(COALESCE(NULLIF(final_fault_code, ''),
                                                        LEFT(COALESCE(diagnosis_text, ''), 120)))
                             ) AS agg
                        WHERE LENGTH(fault_key) > 0
                        ORDER BY cnt DESC
                        LIMIT :lim
                        """);
        q.setParameter("lim", limit);
        return q.getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> monthlyCompletedAndReturns(int monthsBack) {
        LocalDate since = LocalDate.now().minusMonths(monthsBack).withDayOfMonth(1);
        Query q = entityManager.createNativeQuery(
                """
                        SELECT date_trunc('month', repair_date) AS m,
                               COUNT(*) AS completed,
                               SUM(CASE WHEN returned_after_repair THEN 1 ELSE 0 END) AS returned
                        FROM repair_cases
                        WHERE LOWER(repair_status) = 'completed'
                          AND repair_date >= :since
                        GROUP BY m
                        ORDER BY m ASC
                        """);
        q.setParameter("since", since.atStartOfDay());
        return q.getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> repairsByDeviceType() {
        return entityManager
                .createNativeQuery(
                        """
                                SELECT device_type, COUNT(*) AS cnt
                                FROM repair_cases
                                WHERE LOWER(repair_status) = 'completed'
                                GROUP BY device_type
                                ORDER BY cnt DESC
                                """)
                .getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> topComponentsWithReturnRate(int limit) {
        Query q = entityManager.createNativeQuery(
                """
                        SELECT p.part_name,
                               COUNT(DISTINCT p.case_id) AS uses,
                               SUM(CASE WHEN c.returned_after_repair THEN 1 ELSE 0 END)::double precision
                                   / NULLIF(COUNT(DISTINCT p.case_id), 0) AS rr
                        FROM repair_case_parts p
                                 JOIN repair_cases c ON c.case_id = p.case_id
                        WHERE LOWER(c.repair_status) = 'completed'
                        GROUP BY p.part_name
                        ORDER BY uses DESC
                        LIMIT :lim
                        """);
        q.setParameter("lim", limit);
        return q.getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<com.aidevice.smartfix.model.RepairCase> loadRecentCompletedForPatterns(int limit) {
        return entityManager
                .createQuery(
                        "SELECT rc FROM RepairCase rc WHERE LOWER(rc.repairStatus) = 'completed' ORDER BY rc.repairDate DESC",
                        com.aidevice.smartfix.model.RepairCase.class)
                .setMaxResults(limit)
                .getResultList();
    }
}
