package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.OrganizerMapper
import se.scoreboard.service.UserService
import java.util.*
import com.fasterxml.jackson.databind.ObjectMapper



@RestController
@CrossOrigin
@RequestMapping("/api")
class UserController @Autowired constructor(
        val userService: UserService,
        val userRepository: UserRepository) {

    private lateinit var organizerMapper: OrganizerMapper
    private lateinit var bCryptPasswordEncoder: BCryptPasswordEncoder

    init {
        organizerMapper = Mappers.getMapper(OrganizerMapper::class.java)
        bCryptPasswordEncoder = BCryptPasswordEncoder()
    }

    @GetMapping("/user")
    fun getUsers(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = userService.search(filter, pageable)

    @GetMapping("/user/{id}")
    fun getUser(@PathVariable("id") id: Int) = userService.findById(id)

    @GetMapping("/user/{id}/organizer")
    fun getUserOrganizers(@PathVariable("id") id: Int) : List<OrganizerDto> =
            userService.fetchEntity(id).organizers.map { organizer -> organizerMapper.convertToDto(organizer) }

    @PostMapping("/user")
    fun createUser(@RequestBody user : UserDto) = userService.create(user)

    @PutMapping("/user/{id}")
    fun updateUser(
            @PathVariable("id") id: Int,
            @RequestBody user : UserDto) = userService.update(id, user)

    @DeleteMapping("/user/{id}")
    fun deleteUser(@PathVariable("id") id: Int) = userService.delete(id)

    data class AuthData(val username: String, val password: String)

    @PostMapping("/user/login", produces = arrayOf("application/json"))
    fun login(@RequestBody auth: AuthData) : ResponseEntity<String> {
        val user = userRepository.findByEmail(auth.username)
        if (bCryptPasswordEncoder.matches(auth.password, user?.password)) {
            val token = Base64.getEncoder().encodeToString((auth.username + ":" + auth.password).toByteArray())
            return ResponseEntity(ObjectMapper().writeValueAsString(token), HttpStatus.OK)
        } else {
            return ResponseEntity(HttpStatus.FORBIDDEN)
        }
    }
}
