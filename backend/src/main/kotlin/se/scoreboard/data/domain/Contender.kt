package se.scoreboard.data.domain

import java.io.Serializable
import java.util.*
import javax.persistence.*
import javax.persistence.GenerationType.IDENTITY

@Entity
@Table(name = "contender", uniqueConstraints = arrayOf(UniqueConstraint(columnNames = arrayOf("registration_code"))))
open class Contender (
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY, cascade = arrayOf(CascadeType.MERGE))
    @JoinColumns(
            JoinColumn(name = "class_id", referencedColumnName = "id", nullable = false),
            JoinColumn(name = "contest_id", referencedColumnName = "contest_id", nullable = false))
    @Access(AccessType.PROPERTY)
    open var compClass: CompClass? = null,

    @ManyToOne(fetch = FetchType.LAZY, cascade = arrayOf(CascadeType.MERGE))
    @JoinColumn(name = "contest_id", nullable = false, insertable = false, updatable = false)
    @Access(AccessType.PROPERTY)
    open var contest: Contest? = null,

    @Column(name = "registration_code", unique = true, nullable = false, length = 16)
    open var registrationCode: String? = null,

    @Column(name = "name", nullable = false, length = 64)
    open var name: String? = null,

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "entered", length = 26)
    open var entered: Date? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "contender")
    open var ticks: MutableSet<Tick> = HashSet(0)) : Serializable, AbstractEntity<Int>
