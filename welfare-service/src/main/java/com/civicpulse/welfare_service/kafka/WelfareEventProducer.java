package com.civicpulse.welfare_service.kafka;

import com.civicpulse.welfare_service.event.BenefitIssuedEvent;
import com.civicpulse.welfare_service.event.WelfareApplicationApprovedEvent;
import com.civicpulse.welfare_service.event.WelfareApplicationRejectedEvent;
import com.civicpulse.welfare_service.event.WelfareApplicationSubmittedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class WelfareEventProducer {

    private static final String APPLICATION_SUBMITTED_TOPIC =
            "welfare-application-submitted";
private static final String APPLICATION_APPROVED_TOPIC =
        "welfare-application-approved";
    private final KafkaTemplate<String, Object> kafkaTemplate;
private static final String APPLICATION_REJECTED_TOPIC =
        "welfare-application-rejected";
        private static final String BENEFIT_ISSUED_TOPIC =
        "benefit-issued";
    public WelfareEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishApplicationSubmitted(
            WelfareApplicationSubmittedEvent event) {

        kafkaTemplate.send(APPLICATION_SUBMITTED_TOPIC, event);

        System.out.println(
                "Welfare Application Submitted Event Published Successfully"
        );
    }
    public void publishApplicationApproved(
        WelfareApplicationApprovedEvent event) {

    kafkaTemplate.send(
            APPLICATION_APPROVED_TOPIC,
            event
    );

    System.out.println(
            "Welfare Application Approved Event Published Successfully"
    );
}
public void publishApplicationRejected(
        WelfareApplicationRejectedEvent event) {

    kafkaTemplate.send(
            APPLICATION_REJECTED_TOPIC,
            event
    );

    System.out.println(
            "Welfare Application Rejected Event Published Successfully"
    );
}
public void publishBenefitIssued(BenefitIssuedEvent event) {

    kafkaTemplate.send(
            BENEFIT_ISSUED_TOPIC,
            event
    );

    System.out.println(
            "Benefit Issued Event Published Successfully"
    );
}
}