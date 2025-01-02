package com.bracit.epms.repository;

import com.bracit.epms.domain.ExtraquestionAns;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExtraquestionAns entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExtraquestionAnsRepository extends JpaRepository<ExtraquestionAns, Long> {}
