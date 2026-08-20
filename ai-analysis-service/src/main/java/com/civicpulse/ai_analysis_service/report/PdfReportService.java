package com.civicpulse.ai_analysis_service.report;

import com.civicpulse.ai_analysis_service.dto.GrievanceAnalysisRequest;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PdfReportService {

    private static final Color NAVY = new Color(18, 43, 72);
    private static final Color BLUE = new Color(39, 104, 190);
    private static final Color LIGHT_BLUE = new Color(235, 243, 252);
    private static final Color LIGHT_GREY = new Color(245, 247, 250);
    private static final Color BORDER = new Color(220, 226, 234);
    private static final Color DARK_GREY = new Color(65, 72, 82);
    private static final Color GREEN = new Color(39, 135, 82);
    private static final Color ORANGE = new Color(224, 130, 35);
    private static final Color RED = new Color(205, 65, 65);
    private static final Color PURPLE = new Color(112, 76, 182);

    /**
     * New full-system AI governance report.
     *
     * administrativeData is the live map returned by
     * AdminDataAggregatorService.collectAdministrativeData().
     */
    public byte[] generateAdministrativeReport(
            Map<String, Object> administrativeData,
            String analysis
    ) {
        try {
            Map<String, Object> data =
                    administrativeData == null
                            ? new LinkedHashMap<>()
                            : administrativeData;

            ByteArrayOutputStream output = new ByteArrayOutputStream();

            Document document = new Document(
                    PageSize.A4,
                    40,
                    40,
                    45,
                    55
            );

            PdfWriter writer =
                    PdfWriter.getInstance(document, output);

            writer.setPageEvent(new ReportFooter());
            document.open();

            Font titleFont = font(21, Font.BOLD, Color.WHITE);
            Font subtitleFont = font(10, Font.NORMAL, Color.WHITE);
            Font sectionFont = font(14, Font.BOLD, NAVY);
            Font bodyFont = font(9.5f, Font.NORMAL, DARK_GREY);
            Font smallFont = font(8, Font.NORMAL, DARK_GREY);
            Font cardTitleFont = font(8, Font.BOLD, DARK_GREY);

            addHeader(document, titleFont, subtitleFont);
            addHero(document, titleFont, subtitleFont);

            // =====================================================
            // 1. SYSTEM OVERVIEW
            // =====================================================
            addSectionTitle(
                    document,
                    "SYSTEM OVERVIEW",
                    sectionFont
            );

            Map<String, Integer> totals = new LinkedHashMap<>();
            totals.put("Citizens", collectionSize(data.get("citizens")));
            totals.put("Officers", collectionSize(data.get("officers")));
            totals.put("Departments", collectionSize(data.get("departments")));
            totals.put("Grievances", collectionSize(data.get("grievances")));
            totals.put("Applications", collectionSize(data.get("applications")));
            totals.put("Certificates", collectionSize(data.get("certificates")));
            totals.put("Welfare Schemes", collectionSize(data.get("welfare")));
            totals.put("Notifications", collectionSize(data.get("notifications")));

            addStatCards(document, totals, cardTitleFont);
            document.add(new Paragraph(" "));

            addBarChart(document, totals, BLUE);

            // =====================================================
            // 2. GRIEVANCE INTELLIGENCE
            // =====================================================
            addSectionTitle(
                    document,
                    "GRIEVANCE INTELLIGENCE",
                    sectionFont
            );

            java.util.List<Map<String, Object>> grievances =
                    collection(data.get("grievances"));

            Map<String, Integer> grievanceStatus =
                    countBy(grievances,
                            item -> value(item,
                                    "status",
                                    "Unknown"));

            Map<String, Integer> grievancePriority =
                    countBy(grievances,
                            item -> value(item,
                                    "priority",
                                    "Unknown"));

            Map<String, Integer> grievanceDepartments =
                    countBy(grievances,
                            item -> value(item,
                                    "departmentName",
                                    "department",
                                    "department_name",
                                    "Unknown"));

            Map<String, Integer> grievanceCategories =
                    countBy(grievances,
                            item -> value(item,
                                    "category",
                                    "Unknown"));

            addBarChart(
                    document,
                    grievanceStatus,
                    BLUE
            );

            addSubTitle(
                    document,
                    "Priority Distribution",
                    bodyFont
            );

            addBarChart(
                    document,
                    grievancePriority,
                    RED
            );

            addSubTitle(
                    document,
                    "Department Workload",
                    bodyFont
            );

            addBarChart(
                    document,
                    grievanceDepartments,
                    ORANGE
            );

            addSubTitle(
                    document,
                    "Complaint Categories",
                    bodyFont
            );

            addBarChart(
                    document,
                    grievanceCategories,
                    GREEN
            );

            int escalated = countBoolean(
                    grievances,
                    "escalated"
            );

            int unassigned = 0;

            for (Map<String, Object> grievance : grievances) {
                String assigned = value(
                        grievance,
                        "assignedOfficer",
                        "assignedOfficerId",
                        "officerId",
                        ""
                );

                if (assigned == null ||
                        assigned.isBlank() ||
                        assigned.equalsIgnoreCase("null") ||
                        assigned.equalsIgnoreCase("unknown")) {
                    unassigned++;
                }
            }

            addInsightCards(
        document,
        new String[][]{
                {"Total Grievances", String.valueOf(grievances.size())},
                {"Escalated", String.valueOf(escalated)},
                {"Unassigned", String.valueOf(unassigned)}
        },
        cardTitleFont
);

            // =====================================================
            // 3. APPLICATION PERFORMANCE
            // =====================================================
            addSectionTitle(
                    document,
                    "APPLICATION AND SERVICE PERFORMANCE",
                    sectionFont
            );

            java.util.List<Map<String, Object>> applications =
                    collection(data.get("applications"));

            Map<String, Integer> applicationStatus =
                    countBy(
                            applications,
                            item -> value(
                                    item,
                                    "status",
                                    "applicationStatus",
                                    "Unknown"
                            )
                    );

            Map<String, Integer> applicationTypes =
                    countBy(
                            applications,
                            item -> value(
                                    item,
                                    "applicationType",
                                    "type",
                                    "serviceType",
                                    "Unknown"
                            )
                    );

            addSubTitle(
                    document,
                    "Application Status",
                    bodyFont
            );
            addBarChart(document, applicationStatus, BLUE);

            addSubTitle(
                    document,
                    "Application Types",
                    bodyFont
            );
            addBarChart(document, applicationTypes, PURPLE);

            // =====================================================
            // 4. WELFARE
            // =====================================================
            addSectionTitle(
                    document,
                    "WELFARE PROGRAMME ANALYSIS",
                    sectionFont
            );

            java.util.List<Map<String, Object>> welfare =
                    collection(data.get("welfare"));

            Map<String, Integer> welfareTypes =
                    countBy(
                            welfare,
                            item -> value(
                                    item,
                                    "category",
                                    "type",
                                    "schemeType",
                                    "Unknown"
                            )
                    );

            addBarChart(document, welfareTypes, GREEN);

            addMoneyTable(
                    document,
                    "Welfare Budget Snapshot",
                    welfare
            );

            // =====================================================
            // 5. CERTIFICATES
            // =====================================================
            addSectionTitle(
                    document,
                    "CERTIFICATE SERVICES",
                    sectionFont
            );

            java.util.List<Map<String, Object>> certificates =
                    collection(data.get("certificates"));

            Map<String, Integer> certificateTypes =
                    countBy(
                            certificates,
                            item -> value(
                                    item,
                                    "certificateType",
                                    "type",
                                    "applicationType",
                                    "Unknown"
                            )
                    );

            Map<String, Integer> certificateIssuers =
                    countBy(
                            certificates,
                            item -> value(
                                    item,
                                    "issuedBy",
                                    "issuer",
                                    "issuingDepartment",
                                    "departmentName",
                                    "Unknown"
                            )
                    );

            addSubTitle(
                    document,
                    "Certificate Types",
                    bodyFont
            );
            addBarChart(document, certificateTypes, BLUE);

            addSubTitle(
                    document,
                    "Issuing Departments / Officers",
                    bodyFont
            );
            addBarChart(document, certificateIssuers, PURPLE);

            // =====================================================
            // 6. OFFICER / DEPARTMENT
            // =====================================================
            addSectionTitle(
                    document,
                    "OFFICER AND DEPARTMENT PERFORMANCE",
                    sectionFont
            );

            java.util.List<Map<String, Object>> officers =
                    collection(data.get("officers"));

            Map<String, Integer> officerDepartments =
                    countBy(
                            officers,
                            item -> value(
                                    item,
                                    "departmentName",
                                    "department",
                                    "department_name",
                                    "Unknown"
                            )
                    );

            addBarChart(
                    document,
                    officerDepartments,
                    BLUE
            );

            addDepartmentTable(
                    document,
                    officers,
                    grievances
            );

            // =====================================================
            // 7. BUDGET
            // =====================================================
            addSectionTitle(
                    document,
                    "BUDGET AND RESOURCE OBSERVATIONS",
                    sectionFont
            );

            Map<String, Object> reports =
                    object(data.get("reports"));

            double totalBudget =
                    number(
                            reports,
                            "totalBudget",
                            "budget",
                            "total"
                    );

            double allocated =
                    number(
                            reports,
                            "allocated",
                            "allocatedAmount",
                            "totalAllocated"
                    );

            double spent =
                    number(
                            reports,
                            "spent",
                            "spentAmount",
                            "totalSpent",
                            "expenditure"
                    );

            if (allocated == 0 && totalBudget > 0) {
                allocated = totalBudget;
            }

            double remaining =
                    Math.max(allocated - spent, 0);

            double utilization =
                    allocated > 0
                            ? (spent * 100.0) / allocated
                            : 0;

            addBudgetCards(
                    document,
                    totalBudget,
                    allocated,
                    spent,
                    remaining,
                    utilization,
                    cardTitleFont
            );

            // =====================================================
            // 8. NOTIFICATIONS
            // =====================================================
            addSectionTitle(
                    document,
                    "NOTIFICATIONS",
                    sectionFont
            );

            java.util.List<Map<String, Object>> notifications =
                    collection(data.get("notifications"));

            Map<String, Integer> notificationStatus =
                    countBy(
                            notifications,
                            item -> value(
                                    item,
                                    "status",
                                    "notificationStatus",
                                    "Unknown"
                            )
                    );

            addBarChart(
                    document,
                    notificationStatus,
                    ORANGE
            );

            // =====================================================
            // 9. CROSS-SERVICE SNAPSHOT
            // =====================================================
            addSectionTitle(
                    document,
                    "CROSS-SERVICE ADMINISTRATIVE SNAPSHOT",
                    sectionFont
            );

            addCrossServiceTable(
                    document,
                    totals,
                    escalated,
                    unassigned,
                    utilization
            );

            // =====================================================
            // 10. AI ANALYSIS
            // =====================================================
            addSectionTitle(
                    document,
                    "AI GOVERNANCE ANALYSIS",
                    sectionFont
            );

            addAnalysisContent(
                    document,
                    analysis,
                    bodyFont,
                    sectionFont
            );

            // =====================================================
            // 11. ACTION GUIDE
            // =====================================================
            addSectionTitle(
                    document,
                    "PRIORITY ACTION PLAN",
                    sectionFont
            );

            addActionCards(
                    document,
                    bodyFont
            );

            // =====================================================
            // 12. DATA LIMITATIONS
            // =====================================================
            addSectionTitle(
                    document,
                    "DATA LIMITATIONS",
                    sectionFont
            );

            addDataLimitations(
                    document,
                    data,
                    bodyFont
            );

            addNotice(
                    document,
                    smallFont
            );

            document.close();

            return output.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to generate AI governance PDF report",
                    e
            );
        }
    }

    /**
     * Keeps the existing grievance-only method working.
     * Existing callers do not have to be changed immediately.
     */
    public byte[] generateReport(
            java.util.List<GrievanceAnalysisRequest> grievances,
            String analysis
    ) {
        Map<String, Object> data =
                new LinkedHashMap<>();

        java.util.List<Map<String, Object>> records =
                new ArrayList<>();

        if (grievances != null) {
            for (GrievanceAnalysisRequest g : grievances) {
                Map<String, Object> item =
                        new LinkedHashMap<>();

                item.put("id", g.getId());
                item.put("department", g.getDepartment());
                item.put("category", g.getCategory());
                item.put("priority", g.getPriority());
                item.put("status", g.getStatus());
                item.put("assignedOfficer", g.getAssignedOfficer());
                item.put("createdAt", g.getCreatedAt());
                item.put("dueDate", g.getDueDate());
                item.put("slaHours", g.getSlaHours());
                item.put("escalated", g.isEscalated());
                item.put("title", g.getTitle());
                item.put("description", g.getDescription());
                item.put("remarks", g.getRemarks());

                records.add(item);
            }
        }

        data.put("grievances", records);

        return generateAdministrativeReport(
                data,
                analysis
        );
    }

    private Font font(
            float size,
            int style,
            Color color
    ) {
        return FontFactory.getFont(
                FontFactory.HELVETICA,
                size,
                style,
                color
        );
    }

    private void addHeader(
            Document document,
            Font titleFont,
            Font subtitleFont
    ) {
        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{70, 30});

        PdfPCell brandCell = new PdfPCell();
        brandCell.setBackgroundColor(NAVY);
        brandCell.setBorder(Rectangle.NO_BORDER);
        brandCell.setPadding(16);

        Paragraph brand = new Paragraph();
        brand.add(new Chunk(
                "SMART GOVERNANCE PLATFORM",
                titleFont
        ));
        brand.add(Chunk.NEWLINE);
        brand.add(new Chunk(
                "Administrative Operations & Citizen Assistance",
                subtitleFont
        ));

        brandCell.addElement(brand);
        header.addCell(brandCell);

        PdfPCell infoCell = new PdfPCell();
        infoCell.setBackgroundColor(NAVY);
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoCell.setPadding(16);

        Paragraph info = new Paragraph();
        info.setAlignment(Element.ALIGN_RIGHT);
        info.add(new Chunk(
                "AI GOVERNANCE REPORT",
                font(10, Font.BOLD, Color.WHITE)
        ));
        info.add(Chunk.NEWLINE);
        info.add(new Chunk(
                LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern(
                                "dd MMM yyyy"
                        )
                ),
                subtitleFont
        ));
        info.add(Chunk.NEWLINE);
        info.add(new Chunk(
                LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern(
                                "hh:mm a"
                        )
                ),
                subtitleFont
        ));

        infoCell.addElement(info);
        header.addCell(infoCell);

        document.add(header);
        document.add(new Paragraph(" "));
    }

    private void addHero(
            Document document,
            Font titleFont,
            Font subtitleFont
    ) {
        PdfPTable hero = new PdfPTable(1);
        hero.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(31, 76, 128));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(18);

        cell.addElement(
                new Paragraph(
                        "AI Administrative Intelligence Report",
                        titleFont
                )
        );

        cell.addElement(
                new Paragraph(
                        "Detailed system-wide operational analysis, visual evidence and AI recommendations",
                        subtitleFont
                )
        );

        hero.addCell(cell);
        document.add(hero);
        document.add(new Paragraph(" "));
    }

    private void addStatCards(
            Document document,
            Map<String, Integer> values,
            Font titleFont
    ) {
        java.util.List<Map.Entry<String, Integer>> entries =
                new ArrayList<>(values.entrySet());

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        int i = 0;

        for (Map.Entry<String, Integer> entry : entries) {
            Color accent =
                    switch (i % 4) {
                        case 1 -> GREEN;
                        case 2 -> ORANGE;
                        case 3 -> PURPLE;
                        default -> BLUE;
                    };

            addStatCard(
                    table,
                    entry.getKey(),
                    String.valueOf(entry.getValue()),
                    accent,
                    titleFont
            );

            i++;

            if (i == 8) {
                break;
            }
        }

        document.add(table);
    }

    private void addStatCard(
            PdfPTable table,
            String title,
            String value,
            Color accent,
            Font titleFont
    ) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.WHITE);
        cell.setBorderColor(BORDER);
        cell.setPadding(11);

        cell.addElement(
                new Paragraph(title, titleFont)
        );

        cell.addElement(
                new Paragraph(
                        value,
                        font(
                                18,
                                Font.BOLD,
                                accent
                        )
                )
        );

        table.addCell(cell);
    }

    private void addInsightCards(
            Document document,
            String[][] cards,
            Font titleFont
    ) {
        PdfPTable table = new PdfPTable(cards.length);
        table.setWidthPercentage(100);

        for (String[] card : cards) {
            Color color = BLUE;

            if (card.length > 2) {
                try {
                    color = Color.decode(card[2]);
                } catch (Exception ignored) {
                }
            }

            addStatCard(
                    table,
                    card[0],
                    card[1],
                    color,
                    titleFont
            );
        }

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private void addBarChart(
        Document document,
        Map<String, Integer> data,
        Color barColor
) {

    if (data == null || data.isEmpty()) {

        document.add(
                new Paragraph(
                        "No data available for this chart.",
                        font(
                                9,
                                Font.ITALIC,
                                DARK_GREY
                        )
                )
        );

        document.add(new Paragraph(" "));
        return;
    }

    java.util.List<Map.Entry<String, Integer>> entries =
            new ArrayList<>(data.entrySet());

    entries.sort(
            Map.Entry.<String, Integer>comparingByValue()
                    .reversed()
    );

    if (entries.size() > 10) {
        entries =
                new ArrayList<>(
                        entries.subList(0, 10)
                );
    }

    /*
     * IMPORTANT:
     * Never allow max to become zero.
     *
     * Budget data can legitimately contain:
     *
     * Spent     = 0
     * Remaining = 0
     *
     * In that situation a chart still needs to render,
     * but percentage calculations must not divide by zero.
     */
    int max =
            entries.stream()
                    .mapToInt(
                            entry -> Math.max(
                                    0,
                                    entry.getValue()
                            )
                    )
                    .max()
                    .orElse(0);

    /*
     * If every value is zero, use 1 only as the
     * mathematical chart scale.
     *
     * This prevents:
     *
     * value * 100 / max
     *
     * from becoming:
     *
     * 0 * 100 / 0
     */
    int chartMax =
            max <= 0
                    ? 1
                    : max;

    PdfPTable chart =
            new PdfPTable(1);

    chart.setWidthPercentage(100);

    for (Map.Entry<String, Integer> entry : entries) {

        String name =
                entry.getKey();

        int value =
                Math.max(
                        0,
                        entry.getValue()
                );

        PdfPCell outer =
                new PdfPCell();

        outer.setBorder(
                Rectangle.NO_BORDER
        );

        outer.setPaddingTop(3);
        outer.setPaddingBottom(3);

        PdfPTable row =
                new PdfPTable(2);

        row.setWidthPercentage(100);

        row.setWidths(
                new float[]{
                        32,
                        68
                }
        );

        // --------------------------------------------
        // LABEL
        // --------------------------------------------

        PdfPCell label =
                new PdfPCell(
                        new Phrase(
                                name,
                                font(
                                        8.5f,
                                        Font.NORMAL,
                                        DARK_GREY
                                )
                        )
                );

        label.setBorder(
                Rectangle.NO_BORDER
        );

        label.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        row.addCell(label);

        // --------------------------------------------
        // BAR
        // --------------------------------------------

        PdfPCell area =
                new PdfPCell();

        area.setBorder(
                Rectangle.NO_BORDER
        );

        /*
         * Safe percentage calculation.
         *
         * chartMax can never be zero.
         */
        int percentage =
                (value * 100) / chartMax;

        /*
         * A non-zero value should always have
         * a visible bar.
         */
        if (value > 0) {

            percentage =
                    Math.max(
                            2,
                            percentage
                    );

        } else {

            percentage = 0;
        }

        /*
         * Make sure the percentage never exceeds
         * 100.
         */
        percentage =
                Math.min(
                        100,
                        percentage
                );

        /*
         * When percentage = 0, the filled part
         * cannot have zero width in the PDF table.
         *
         * Give it a tiny width and make the remaining
         * section the rest.
         */
        int filledWidth =
                percentage > 0
                        ? percentage
                        : 1;

        int emptyWidth =
                Math.max(
                        1,
                        100 - filledWidth
                );

        PdfPTable bar =
                new PdfPTable(2);

        bar.setWidths(
                new float[]{
                        filledWidth,
                        emptyWidth
                }
        );

        PdfPCell filled =
                new PdfPCell(
                        new Phrase(" ")
                );

        filled.setBackgroundColor(
                value > 0
                        ? barColor
                        : LIGHT_GREY
        );

        filled.setBorder(
                Rectangle.NO_BORDER
        );

        filled.setFixedHeight(11);

        PdfPCell empty =
                new PdfPCell(
                        new Phrase(" ")
                );

        empty.setBackgroundColor(
                LIGHT_GREY
        );

        empty.setBorder(
                Rectangle.NO_BORDER
        );

        empty.setFixedHeight(11);

        bar.addCell(filled);
        bar.addCell(empty);

        area.addElement(bar);

        // --------------------------------------------
        // VALUE
        // --------------------------------------------

        area.addElement(
                new Paragraph(
                        String.valueOf(value),
                        font(
                                8,
                                Font.BOLD,
                                NAVY
                        )
                )
        );

        row.addCell(area);

        outer.addElement(row);

        chart.addCell(outer);
    }

    document.add(chart);
    document.add(new Paragraph(" "));
}

    private void addSubTitle(
            Document document,
            String text,
            Font font
    ) {
        Paragraph p =
                new Paragraph(
                        text,
                        font
                );

        p.setSpacingBefore(4);
        p.setSpacingAfter(4);

        document.add(p);
    }

    private void addMoneyTable(
            Document document,
            String title,
            java.util.List<Map<String, Object>> records
    ) {
        if (records.isEmpty()) {
            return;
        }

        addSubTitle(
                document,
                title,
                font(10, Font.BOLD, NAVY)
        );

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{45, 27, 28});

        addHeaderCell(table, "Scheme");
        addHeaderCell(table, "Allocated");
        addHeaderCell(table, "Spent");

        for (Map<String, Object> item : records) {
            String name =
                    value(
                            item,
                            "name",
                            "schemeName",
                            "title",
                            "Unknown"
                    );

            double allocated =
                    number(
                            item,
                            "allocatedBudget",
                            "allocated",
                            "budget",
                            "amount"
                    );

            double spent =
                    number(
                            item,
                            "spentAmount",
                            "spent",
                            "utilizedBudget",
                            "utilized"
                    );

            addBodyCell(table, name);
            addBodyCell(
                    table,
                    money(allocated)
            );
            addBodyCell(
                    table,
                    money(spent)
            );
        }

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private void addHeaderCell(
            PdfPTable table,
            String text
    ) {
        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text,
                                font(
                                        8,
                                        Font.BOLD,
                                        Color.WHITE
                                )
                        )
                );

        cell.setBackgroundColor(NAVY);
        cell.setPadding(7);
        cell.setBorderColor(BORDER);

        table.addCell(cell);
    }

    private void addBodyCell(
            PdfPTable table,
            String text
    ) {
        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text,
                                font(
                                        8,
                                        Font.NORMAL,
                                        DARK_GREY
                                )
                        )
                );

        cell.setPadding(6);
        cell.setBorderColor(BORDER);

        table.addCell(cell);
    }

    private void addDepartmentTable(
            Document document,
            java.util.List<Map<String, Object>> officers,
            java.util.List<Map<String, Object>> grievances
    ) {
        Map<String, Integer> officerCounts =
                countBy(
                        officers,
                        item -> value(
                                item,
                                "departmentName",
                                "department",
                                "department_name",
                                "Unknown"
                        )
                );

        Map<String, Integer> grievanceCounts =
                countBy(
                        grievances,
                        item -> value(
                                item,
                                "departmentName",
                                "department",
                                "department_name",
                                "Unknown"
                        )
                );

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{45, 27, 28});

        addHeaderCell(table, "Department");
        addHeaderCell(table, "Officers");
        addHeaderCell(table, "Grievances");

        java.util.List<String> departments =
                new ArrayList<>();

        departments.addAll(officerCounts.keySet());

        for (String department : grievanceCounts.keySet()) {
            if (!departments.contains(department)) {
                departments.add(department);
            }
        }

        departments.sort(
                Comparator.comparingInt(
                        d -> -grievanceCounts.getOrDefault(d, 0)
                )
        );

        int limit =
                Math.min(departments.size(), 12);

        for (int i = 0; i < limit; i++) {
            String department = departments.get(i);

            addBodyCell(table, department);
            addBodyCell(
                    table,
                    String.valueOf(
                            officerCounts.getOrDefault(
                                    department,
                                    0
                            )
                    )
            );
            addBodyCell(
                    table,
                    String.valueOf(
                            grievanceCounts.getOrDefault(
                                    department,
                                    0
                            )
                    )
            );
        }

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private void addBudgetCards(
            Document document,
            double total,
            double allocated,
            double spent,
            double remaining,
            double utilization,
            Font titleFont
    ) {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        addStatCard(
                table,
                "TOTAL BUDGET",
                money(total),
                BLUE,
                titleFont
        );

        addStatCard(
                table,
                "ALLOCATED",
                money(allocated),
                PURPLE,
                titleFont
        );

        addStatCard(
                table,
                "SPENT",
                money(spent),
                GREEN,
                titleFont
        );

        addStatCard(
                table,
                "UTILIZATION",
                String.format(
                        Locale.ENGLISH,
                        "%.1f%%",
                        utilization
                ),
                utilization < 25 ? ORANGE : GREEN,
                titleFont
        );

        document.add(table);
        document.add(new Paragraph(" "));

        addBarChart(
                document,
                new LinkedHashMap<>() {{
                    put("Spent", (int) Math.round(spent));
                    put("Remaining", (int) Math.round(remaining));
                }},
                GREEN
        );
    }

    private void addCrossServiceTable(
            Document document,
            Map<String, Integer> totals,
            int escalated,
            int unassigned,
            double utilization
    ) {
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{45, 25, 30});

        addHeaderCell(table, "Indicator");
        addHeaderCell(table, "Value");
        addHeaderCell(table, "Administrative Meaning");

        addCrossRow(
                table,
                "Total citizens",
                totals.getOrDefault("Citizens", 0),
                "Citizen population represented in the live dataset."
        );

        addCrossRow(
                table,
                "Total grievances",
                totals.getOrDefault("Grievances", 0),
                "Current complaint workload."
        );

        addCrossRow(
                table,
                "Unassigned grievances",
                unassigned,
                "Potential workflow or assignment bottleneck."
        );

        addCrossRow(
                table,
                "Escalated grievances",
                escalated,
                "Cases requiring higher-level attention."
        );

        addCrossRow(
                table,
                "Applications",
                totals.getOrDefault("Applications", 0),
                "Current service demand."
        );

        addCrossRow(
                table,
                "Certificates",
                totals.getOrDefault("Certificates", 0),
                "Certificate service activity."
        );

        addCrossRow(
                table,
                "Budget utilization",
                String.format(
                        Locale.ENGLISH,
                        "%.1f%%",
                        utilization
                ),
                "Share of allocated budget represented as spent."
        );

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private void addCrossRow(
            PdfPTable table,
            String indicator,
            Object value,
            String meaning
    ) {
        addBodyCell(table, indicator);
        addBodyCell(table, String.valueOf(value));
        addBodyCell(table, meaning);
    }

    private void addActionCards(
            Document document,
            Font bodyFont
    ) {
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        addActionCard(
                table,
                "1",
                "IDENTIFY",
                "Review critical findings, high-priority grievances, unresolved workload and service bottlenecks.",
                RED,
                bodyFont
        );

        addActionCard(
                table,
                "2",
                "PRIORITIZE",
                "Assign responsible departments and officers to the highest-impact unresolved issues.",
                ORANGE,
                bodyFont
        );

        addActionCard(
                table,
                "3",
                "IMPROVE",
                "Monitor corrective actions using the Analytics page and compare future performance against this report.",
                GREEN,
                bodyFont
        );

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private void addActionCard(
            PdfPTable table,
            String number,
            String title,
            String description,
            Color accent,
            Font bodyFont
    ) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.WHITE);
        cell.setBorderColor(BORDER);
        cell.setPadding(12);

        cell.addElement(
                new Paragraph(
                        number,
                        font(
                                16,
                                Font.BOLD,
                                accent
                        )
                )
        );

        cell.addElement(
                new Paragraph(
                        title,
                        font(
                                9,
                                Font.BOLD,
                                NAVY
                        )
                )
        );

        cell.addElement(
                new Paragraph(
                        description,
                        bodyFont
                )
        );

        table.addCell(cell);
    }

    private void addDataLimitations(
            Document document,
            Map<String, Object> data,
            Font bodyFont
    ) {
        java.util.List<String> missing =
                new ArrayList<>();

        String[] services = {
                "citizens",
                "departments",
                "officers",
                "grievances",
                "applications",
                "welfare",
                "certificates",
                "budgets",
                "reports",
                "audit",
                "notifications"
        };

        for (String service : services) {
            Object value = data.get(service);

            if (value == null) {
                missing.add(
                        service.toUpperCase(Locale.ENGLISH)
                                + " data was unavailable."
                );
            } else if (value instanceof Map<?, ?> map &&
                    Boolean.FALSE.equals(
                            map.get("available")
                    )) {
                missing.add(
                        service.toUpperCase(Locale.ENGLISH)
                                + " service reported unavailable data."
                );
            }
        }

        if (missing.isEmpty()) {
            missing.add(
                    "No complete service-level unavailability was detected in the collected dataset. Individual records may still contain missing fields."
            );
        }

        for (String item : missing) {
            Paragraph p = new Paragraph(
                    "• " + item,
                    bodyFont
            );
            p.setSpacingAfter(4);
            document.add(p);
        }

        document.add(new Paragraph(" "));
    }

    private void addNotice(
            Document document,
            Font smallFont
    ) {
        PdfPTable notice = new PdfPTable(1);
        notice.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(LIGHT_GREY);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(12);

        Paragraph p = new Paragraph();

        p.add(
                new Chunk(
                        "AI GOVERNANCE REPORT NOTICE\n",
                        font(
                                8,
                                Font.BOLD,
                                NAVY
                        )
                )
        );

        p.add(
                new Chunk(
                        "This report combines live administrative data "
                                + "with AI-generated insights. It is intended "
                                + "to support administrative decision-making. "
                                + "Officials should verify important findings "
                                + "against the underlying service records.",
                        smallFont
                )
        );

        cell.addElement(p);
        notice.addCell(cell);

        document.add(notice);
    }

    private void addSectionTitle(
            Document document,
            String title,
            Font font
    ) {
        Paragraph p = new Paragraph();
        p.setSpacingBefore(8);
        p.setSpacingAfter(8);

        p.add(
                new Chunk(
                        "▌ ",
                        FontFactory.getFont(
                                FontFactory.HELVETICA,
                                14,
                                Font.BOLD,
                                BLUE
                        )
                )
        );

        p.add(new Chunk(title, font));
        document.add(p);
    }

    private void addAnalysisContent(
            Document document,
            String analysis,
            Font bodyFont,
            Font sectionFont
    ) {
        if (analysis == null ||
                analysis.trim().isEmpty()) {

            document.add(
                    new Paragraph(
                            "No AI analysis was returned.",
                            bodyFont
                    )
            );

            return;
        }

        String[] lines =
                analysis.split("\\r?\\n");

        for (String raw : lines) {
            String line = cleanMarkdown(raw);

            if (line.isBlank()) {
                document.add(new Paragraph(" "));
                continue;
            }

            if (line.matches("^\\d+[.)]\\s+.*")
                    || isHeading(line)) {

                PdfPTable heading =
                        new PdfPTable(1);

                heading.setWidthPercentage(100);

                PdfPCell cell = new PdfPCell();
                cell.setBackgroundColor(LIGHT_GREY);
                cell.setBorderColor(BORDER);
                cell.setPadding(8);

                cell.addElement(
                        new Paragraph(
                                line,
                                sectionFont
                        )
                );

                heading.addCell(cell);
                document.add(heading);
                document.add(new Paragraph(" "));

            } else if (
                    line.startsWith("•")
                            || line.startsWith("-")
                            || line.startsWith("*")
            ) {

                String bullet =
                        line.substring(1).trim();

                Paragraph p =
                        new Paragraph();

                p.setIndentationLeft(12);
                p.setFirstLineIndent(-8);

                p.add(
                        new Chunk(
                                "✓ ",
                                font(
                                        9,
                                        Font.BOLD,
                                        GREEN
                                )
                        )
                );

                p.add(
                        new Chunk(
                                bullet,
                                bodyFont
                        )
                );

                p.setLeading(14);
                document.add(p);

            } else {

                Paragraph p =
                        new Paragraph(
                                line,
                                bodyFont
                        );

                p.setLeading(14);
                p.setSpacingAfter(4);

                document.add(p);
            }
        }
    }

    private boolean isHeading(String line) {
        String upper = line.toUpperCase(Locale.ENGLISH);

        return upper.contains("EXECUTIVE SUMMARY")
                || upper.contains("SYSTEM OVERVIEW")
                || upper.contains("CITIZEN")
                || upper.contains("GRIEVANCE INTELLIGENCE")
                || upper.contains("APPLICATION")
                || upper.contains("WELFARE")
                || upper.contains("CERTIFICATE")
                || upper.contains("OFFICER")
                || upper.contains("BUDGET")
                || upper.contains("CROSS-SERVICE")
                || upper.contains("AREAS REQUIRING ATTENTION")
                || upper.contains("RECOMMENDED")
                || upper.contains("PRIORITY ACTION")
                || upper.contains("DATA LIMITATIONS")
                || upper.contains("CONCLUSION");
    }

    private String cleanMarkdown(String text) {
        if (text == null) {
            return "";
        }

        return text
                .replace("**", "")
                .replace("__", "")
                .replace("###", "")
                .replace("##", "")
                .replace("#", "")
                .replace("`", "")
                .trim();
    }

    private java.util.List<Map<String, Object>> collection(
            Object value
    ) {
        if (!(value instanceof java.util.List<?> list)) {
            return new ArrayList<>();
        }

        java.util.List<Map<String, Object>> result =
                new ArrayList<>();

        for (Object item : list) {
            if (item instanceof Map<?, ?> map) {
                Map<String, Object> converted =
                        new LinkedHashMap<>();

                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    converted.put(
                            String.valueOf(entry.getKey()),
                            entry.getValue()
                    );
                }

                result.add(converted);
            }
        }

        return result;
    }

    private Map<String, Object> object(Object value) {
        if (!(value instanceof Map<?, ?> map)) {
            return new LinkedHashMap<>();
        }

        Map<String, Object> result =
                new LinkedHashMap<>();

        for (Map.Entry<?, ?> entry : map.entrySet()) {
            result.put(
                    String.valueOf(entry.getKey()),
                    entry.getValue()
            );
        }

        return result;
    }

    private int collectionSize(Object value) {
        if (value instanceof java.util.List<?> list) {
            return list.size();
        }

        return 0;
    }

    private Map<String, Integer> countBy(
            java.util.List<Map<String, Object>> records,
            Function<Map<String, Object>, String> classifier
    ) {
        if (records == null) {
            return new LinkedHashMap<>();
        }

        return records.stream()
                .filter(Objects::nonNull)
                .collect(
                        Collectors.groupingBy(
                                classifier,
                                LinkedHashMap::new,
                                Collectors.summingInt(
                                        item -> 1
                                )
                        )
                );
    }

    private int countBoolean(
            java.util.List<Map<String, Object>> records,
            String key
    ) {
        int count = 0;

        for (Map<String, Object> item : records) {
            Object value = item.get(key);

            if (Boolean.TRUE.equals(value)
                    || "true".equalsIgnoreCase(
                            String.valueOf(value))
                    || "yes".equalsIgnoreCase(
                            String.valueOf(value))) {
                count++;
            }
        }

        return count;
    }

    private String value(
            Map<String, Object> item,
            String... keys
    ) {
        if (item == null) {
            return "Unknown";
        }

        for (String key : keys) {
            Object value = item.get(key);

            if (value != null) {
                String text =
                        String.valueOf(value).trim();

                if (!text.isEmpty()
                        && !"null".equalsIgnoreCase(text)) {
                    return text;
                }
            }
        }

        return keys.length > 0
                ? keys[keys.length - 1]
                : "Unknown";
    }

    private double number(
            Map<String, Object> item,
            String... keys
    ) {
        for (String key : keys) {
            Object value = item.get(key);

            if (value instanceof Number number) {
                return number.doubleValue();
            }

            if (value != null) {
                try {
                    return Double.parseDouble(
                            String.valueOf(value)
                                    .replace(",", "")
                                    .replace("₹", "")
                                    .trim()
                    );
                } catch (Exception ignored) {
                }
            }
        }

        return 0;
    }

    private String money(double value) {
        return String.format(
                Locale.ENGLISH,
                "₹%,.2f",
                value
        );
    }

    private static class ReportFooter
            extends PdfPageEventHelper {

        private final Font footerFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        8,
                        Font.NORMAL,
                        new Color(100, 110, 125)
                );

        @Override
        public void onEndPage(
                PdfWriter writer,
                Document document
        ) {
            try {
                PdfPTable footer =
                        new PdfPTable(2);

                footer.setWidths(
                        new float[]{70, 30}
                );

                footer.setTotalWidth(
                        document.right()
                                - document.left()
                );

                PdfPCell left =
                        new PdfPCell(
                                new Phrase(
                                        "Smart Governance Platform • AI Governance Report",
                                        footerFont
                                )
                        );

                left.setBorder(Rectangle.TOP);
                left.setBorderColor(BORDER);
                left.setPaddingTop(7);

                footer.addCell(left);

                PdfPCell right =
                        new PdfPCell(
                                new Phrase(
                                        "Page "
                                                + writer.getPageNumber(),
                                        footerFont
                                )
                        );

                right.setHorizontalAlignment(
                        Element.ALIGN_RIGHT
                );

                right.setBorder(Rectangle.TOP);
                right.setBorderColor(BORDER);
                right.setPaddingTop(7);

                footer.addCell(right);

                footer.writeSelectedRows(
                        0,
                        -1,
                        document.left(),
                        document.bottomMargin() - 8,
                        writer.getDirectContent()
                );

            } catch (Exception ignored) {
            }
        }
    }
}
