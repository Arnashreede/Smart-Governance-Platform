package com.civicpulse.reporting_service.config;

import com.civicpulse.reporting_service.event.CitizenRegisteredEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;
import com.civicpulse.reporting_service.event.SlaBreachedEvent;
import com.civicpulse.reporting_service.event.GrievanceCreatedEvent;

@Configuration
public class KafkaConfig {

    @Bean
    public ConsumerFactory<String, CitizenRegisteredEvent> consumerFactory() {

        JsonDeserializer<CitizenRegisteredEvent> deserializer =
                new JsonDeserializer<>(CitizenRegisteredEvent.class);

        deserializer.addTrustedPackages("*");

        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "reporting-group");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean(name = "kafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, CitizenRegisteredEvent>
    kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, CitizenRegisteredEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory());

        return factory;
    }

    @Bean
public ConsumerFactory<String, GrievanceCreatedEvent> grievanceConsumerFactory() {

    JsonDeserializer<GrievanceCreatedEvent> deserializer =
            new JsonDeserializer<>(GrievanceCreatedEvent.class);

        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false);

    deserializer.addTrustedPackages("*");

    Map<String, Object> config = new HashMap<>();

    config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    config.put(ConsumerConfig.GROUP_ID_CONFIG, "reporting-group");
    config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

    return new DefaultKafkaConsumerFactory<>(
            config,
            new StringDeserializer(),
            deserializer
    );
}

@Bean(name = "grievanceKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, GrievanceCreatedEvent>
        grievanceKafkaListenerContainerFactory() {

            ConcurrentKafkaListenerContainerFactory<String, GrievanceCreatedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(grievanceConsumerFactory());

    return factory;
}
@Bean
public ConsumerFactory<String, SlaBreachedEvent> slaBreachedConsumerFactory() {

    JsonDeserializer<SlaBreachedEvent> deserializer =
            new JsonDeserializer<>(SlaBreachedEvent.class);

    deserializer.addTrustedPackages("*");
    deserializer.setUseTypeHeaders(false);

    Map<String, Object> config = new HashMap<>();

    config.put(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
            "localhost:9092"
    );

    config.put(
            ConsumerConfig.GROUP_ID_CONFIG,
            "reporting-group"
    );

    config.put(
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class
    );

    config.put(
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
            JsonDeserializer.class
    );

    return new DefaultKafkaConsumerFactory<>(
            config,
            new StringDeserializer(),
            deserializer
    );
}
@Bean(name = "slaBreachedKafkaListenerContainerFactory")
public ConcurrentKafkaListenerContainerFactory<String, SlaBreachedEvent>
slaBreachedKafkaListenerContainerFactory() {

    ConcurrentKafkaListenerContainerFactory<String, SlaBreachedEvent> factory =
            new ConcurrentKafkaListenerContainerFactory<>();

    factory.setConsumerFactory(slaBreachedConsumerFactory());

    return factory;
}
}