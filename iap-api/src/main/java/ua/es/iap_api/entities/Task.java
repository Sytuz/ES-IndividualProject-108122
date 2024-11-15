package ua.es.iap_api.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "user_sub", nullable = false)
    private String userSub;

    @Column(name = "priority", nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.UNDEFINED;

    @Column(name = "completion_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private CompletionStatus completionStatus = CompletionStatus.IDLE;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Task(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public Task(String title, String description, String userSub) {
        this.title = title;
        this.description = description;
        this.userSub = userSub;
    }

    public Task(String title, String description, String userSub, Category category) {
        this.title = title;
        this.description = description;
        this.userSub = userSub;
        this.category = category;
    }
}
