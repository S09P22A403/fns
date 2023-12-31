package ssafy.fns.domain.auth.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class MailHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "mail_history_id")
    private Long id;
    private String email;
    private String code;
    private boolean isAuthed;
    private LocalDateTime sendDate;

    @Builder
    public MailHistory(String email, String code, boolean isAuthed, LocalDateTime sendDate) {
        this.email = email;
        this.code = code;
        this.isAuthed = isAuthed;
        this.sendDate = LocalDateTime.now();
    }

    public boolean checkAuthCode(String code) {
        if (this.code.equals(code)) {
            isAuthed = true;
        }
        return isAuthed;
    }

    public boolean isOverTimeLimit(LocalDateTime curDate) {
        final int TIME_LIMIT = 10;
        LocalDateTime timeLimit = sendDate.plusMinutes(TIME_LIMIT);
        return curDate.isAfter(timeLimit);
    }
}
