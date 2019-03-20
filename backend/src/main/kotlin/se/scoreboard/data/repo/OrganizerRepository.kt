package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Organizer

@Repository
interface OrganizerRepository : CrudRepository<Organizer, Int> {
}