package com.fitness.gamification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // 1. Define the Queue specific to Gamification
    @Bean
    public Queue gamificationQueue() {
        return new Queue("gamification.activity.queue", true);
    }

    // 2. Define the Exchange (Must match Activity Service's exchange name)
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange("fitness.exchange");
    }

    // 3. Bind the Queue to the Exchange
    // This says: "Send a copy of 'activity.tracking' messages to my queue"
    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("activity.tracking");
    }

    // 4. JSON Converter (So we can read the DTO)
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

}
