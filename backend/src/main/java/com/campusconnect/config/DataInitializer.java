package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.repository.EventActivityRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EventActivityRepository activityRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            EventRepository eventRepository,
            RegistrationRepository registrationRepository,
            EventActivityRepository activityRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.activityRepository = activityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already exists
        }

        System.out.println("Initializing sample seed data for CampusConnect...");

        // 1. Create Users
        User admin = new User(
                null,
                "System Admin",
                "admin@campusconnect.com",
                "9876543210",
                "ADM-001",
                passwordEncoder.encode("admin123"),
                Role.ADMIN,
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(admin);

        User organizer1 = new User(
                null,
                "Prof. Alex Morgan",
                "organizer@campusconnect.com",
                "9876543211",
                "ORG-001",
                passwordEncoder.encode("organizer123"),
                Role.ORGANIZER,
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(organizer1);

        User organizer2 = new User(
                null,
                "Elena Gilbert (Tech Club)",
                "techclub@campusconnect.com",
                "9876543212",
                "ORG-002",
                passwordEncoder.encode("organizer123"),
                Role.ORGANIZER,
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(organizer2);

        User student1 = new User(
                null,
                "John Doe",
                "student@campusconnect.com",
                "9876543220",
                "STU-2026-001",
                passwordEncoder.encode("student123"),
                Role.STUDENT,
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(student1);

        User student2 = new User(
                null,
                "Sarah Connor",
                "sarah@campusconnect.com",
                "9876543221",
                "STU-2026-002",
                passwordEncoder.encode("student123"),
                Role.STUDENT,
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(student2);

        User student3 = new User(
                null,
                "David Miller",
                "david@campusconnect.com",
                "9876543222",
                "STU-2026-003",
                passwordEncoder.encode("student123"),
                Role.STUDENT,
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(student3);

        // 2. Create Events
        LocalDate today = LocalDate.now();

        Event event1 = new Event(
                null,
                "TechFest 2026 – Future of AI & Robotics",
                "Join the biggest technology carnival of the year featuring project exhibitions, competitive coding, robotics combat, and keynote addresses from leading industry pioneers.",
                "Fest",
                "Main Campus Auditorium & Tech Block",
                today.plusDays(20),
                "09:30 AM",
                "05:30 PM",
                organizer1,
                300,
                today.plusDays(15),
                "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event1);

        Event event2 = new Event(
                null,
                "AI & Machine Learning Hands-on Workshop",
                "Comprehensive full-day practical workshop covering Deep Learning, PyTorch, Large Language Models (LLMs), and real-world deployment on cloud platforms.",
                "Workshop",
                "Computer Lab 402, CS Department",
                today.plusDays(10),
                "10:00 AM",
                "04:00 PM",
                organizer2,
                80,
                today.plusDays(7),
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event2);

        Event event3 = new Event(
                null,
                "Cultural Fest 2026: 'Sanskriti'",
                "Experience vibrant music, dance, theatrical drama, fashion shows, and live band performances in our grand annual inter-collegiate cultural extravaganza.",
                "Cultural",
                "Open Air Amphitheatre",
                today.plusDays(35),
                "04:00 PM",
                "10:00 PM",
                organizer1,
                500,
                today.plusDays(25),
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event3);

        Event event4 = new Event(
                null,
                "CodeSprint 24-Hour Hackathon",
                "Put your coding, algorithmic, and innovation skills to the test! Form teams of up to 4 and build high-impact solutions for real-world civic and educational problems.",
                "Competition",
                "Innovation Hub & Incubation Center",
                today.plusDays(14),
                "08:00 AM",
                "08:00 AM (Next Day)",
                organizer2,
                150,
                today.plusDays(10),
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event4);

        Event event5 = new Event(
                null,
                "Inter-College Cricket Championship",
                "The annual premier T20 tournament bringing together 16 top college teams competing for glory and trophy honors.",
                "Sports",
                "Campus Sports Complex Stadium",
                today.plusDays(18),
                "08:30 AM",
                "06:00 PM",
                organizer1,
                120,
                today.plusDays(12),
                "https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event5);

        Event event6 = new Event(
                null,
                "Photography & Short Film Exhibition",
                "Showcase your artistic perspective through lens and storytelling. Special masterclass by award-winning documentary filmmakers.",
                "Cultural",
                "Art Gallery, Block B",
                today.plusDays(22),
                "11:00 AM",
                "05:00 PM",
                organizer1,
                100,
                today.plusDays(19),
                "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event6);

        Event event7 = new Event(
                null,
                "Full Stack Web Development with React & Spring Boot",
                "Intensive weekend bootcamp covering architecture, REST APIs, state management, modern UI patterns, and deployment pipelines.",
                "Workshop",
                "Seminar Hall 2",
                today.plusDays(8),
                "09:00 AM",
                "03:30 PM",
                organizer2,
                90,
                today.plusDays(5),
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
                EventStatus.UPCOMING,
                LocalDateTime.now()
        );
        eventRepository.save(event7);

        Event event8 = new Event(
                null,
                "Entrepreneurship & Startup Pitch Summit",
                "Inspiring keynotes from successful tech entrepreneurs, angel investors, and a live pitch competition with seed funding opportunities.",
                "Seminar",
                "Auditorium 1",
                today.minusDays(5),
                "10:00 AM",
                "04:00 PM",
                organizer1,
                200,
                today.minusDays(10),
                "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
                EventStatus.COMPLETED,
                LocalDateTime.now().minusDays(15)
        );
        eventRepository.save(event8);

        // 3. Create Activities
        activityRepository.save(new EventActivity(null, event1, "Keynote Address: Emerging Frontiers of AI", "Opening session by lead AI researcher", "09:30 AM - 11:00 AM", "Auditorium Main Stage"));
        activityRepository.save(new EventActivity(null, event1, "RoboWars: Combat Championship", "Autonomous and remote robot battle rounds", "11:30 AM - 01:30 PM", "Tech Arena"));
        activityRepository.save(new EventActivity(null, event1, "Project Exhibition & Awards", "Grand demo day and cash prize announcements", "02:30 PM - 05:00 PM", "Exhibition Hall"));

        activityRepository.save(new EventActivity(null, event2, "Introduction to LLM Architecture", "Transformer models, tokenization, embeddings", "10:00 AM - 12:30 PM", "Lab 402"));
        activityRepository.save(new EventActivity(null, event2, "Hands-on Fine-tuning & Vector Databases", "Practical coding lab with Python and LangChain", "01:30 PM - 04:00 PM", "Lab 402"));

        activityRepository.save(new EventActivity(null, event3, "Battle of the Bands", "Inter-college musical band showdown", "04:30 PM - 06:30 PM", "Amphitheatre"));
        activityRepository.save(new EventActivity(null, event3, "Classical & Contemporary Dance", "Solo and group choreography performances", "06:45 PM - 08:30 PM", "Amphitheatre"));
        activityRepository.save(new EventActivity(null, event3, "Celebrity DJ Night", "Electrifying finale evening", "08:30 PM - 10:00 PM", "Amphitheatre"));

        activityRepository.save(new EventActivity(null, event4, "Problem Statement Unveiling & Team Huddle", "Orientation and mentor introductions", "08:00 AM - 09:30 AM", "Incubation Hub"));
        activityRepository.save(new EventActivity(null, event4, "Midnight Coding Sprint & Mentorship Review", "Live checkpoints and code evaluations", "11:00 PM - 01:00 AM", "Incubation Hub"));
        activityRepository.save(new EventActivity(null, event4, "Final Project Pitches & Judging", "Presentation to venture partners and faculty", "06:30 AM - 08:00 AM", "Main Stage"));

        // 4. Create Sample Registrations
        registrationRepository.save(new Registration(null, student1, event1, LocalDateTime.now().minusDays(2), RegistrationStatus.REGISTERED));
        registrationRepository.save(new Registration(null, student1, event2, LocalDateTime.now().minusDays(1), RegistrationStatus.REGISTERED));
        registrationRepository.save(new Registration(null, student1, event8, LocalDateTime.now().minusDays(12), RegistrationStatus.ATTENDED));

        registrationRepository.save(new Registration(null, student2, event1, LocalDateTime.now().minusDays(3), RegistrationStatus.REGISTERED));
        registrationRepository.save(new Registration(null, student2, event3, LocalDateTime.now().minusDays(1), RegistrationStatus.REGISTERED));
        registrationRepository.save(new Registration(null, student2, event4, LocalDateTime.now().minusDays(2), RegistrationStatus.REGISTERED));

        registrationRepository.save(new Registration(null, student3, event2, LocalDateTime.now().minusDays(2), RegistrationStatus.REGISTERED));
        registrationRepository.save(new Registration(null, student3, event5, LocalDateTime.now().minusDays(1), RegistrationStatus.REGISTERED));

        System.out.println("CampusConnect sample data successfully seeded!");
    }
}
