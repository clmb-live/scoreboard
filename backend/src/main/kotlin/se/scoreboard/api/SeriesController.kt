package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.SeriesDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.service.SeriesService
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Series"])
class SeriesController @Autowired constructor(
        private val seriesService: SeriesService,
        private var contestMapper: ContestMapper) {

    @GetMapping("/series")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getAllSeries(request: HttpServletRequest, @RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = seriesService.search(request, pageable)

    @GetMapping("/series/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getSeries(@PathVariable("id") id: Int) = seriesService.findById(id)

    @GetMapping("/series/{id}/contest")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getSeriesContests(@PathVariable("id") id: Int) : List<ContestDto> =
            seriesService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PostMapping("/series")
    @PreAuthorize("hasPermission(#series, 'create')")
    @Transactional
    fun createSeries(@RequestBody series : SeriesDto) = seriesService.create(series)

    @PutMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'SeriesDto', 'update') && hasPermission(#series, 'update')")
    @Transactional
    fun updateSeries(
            @PathVariable("id") id: Int,
            @RequestBody series : SeriesDto) = seriesService.update(id, series)

    @DeleteMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'SeriesDto', 'delete')")
    @Transactional
    fun deleteSeries(@PathVariable("id") id: Int) = seriesService.delete(id)
}
