package com.bracit.epms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A FeedbackType.
 */
@Entity
@Table(name = "feedback_type")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FeedbackType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "feedbackname", nullable = false)
    private String feedbackname;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FeedbackType id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFeedbackname() {
        return this.feedbackname;
    }

    public FeedbackType feedbackname(String feedbackname) {
        this.setFeedbackname(feedbackname);
        return this;
    }

    public void setFeedbackname(String feedbackname) {
        this.feedbackname = feedbackname;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FeedbackType)) {
            return false;
        }
        return getId() != null && getId().equals(((FeedbackType) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FeedbackType{" +
            "id=" + getId() +
            ", feedbackname='" + getFeedbackname() + "'" +
            "}";
    }
}
