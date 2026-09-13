interface Course {
    name: string;
    duration: number;
    students: string[];
}

class OnlineCourse implements Course {
    name: string;
    duration: number;
    students: string[];

    constructor(name: string, duration: number) {
        this.name = name;
        this.duration = duration;
        this.students = [];
    }

    registerStudent(student: string): void {
        if (!this.isStudentRegistered(student)) {
            this.students.push(student);
            console.log(`${student} registered for ${this.name}.`);
        } else {
            console.log(`${student} is already registered for ${this.name}.`);
        }
    }

    isStudentRegistered(student: string): boolean {
        return this.students.includes(student);
    }
}

class CourseManager {
    private courses: Course[];

    constructor() {
        this.courses = [];
    }

    addCourse(course: Course): void {
        this.courses.push(course);
    }

    removeCourse(courseName: string): void {
        this.courses = this.courses.filter(
            course => course.name.toLowerCase() !== courseName.toLowerCase()
        );
    }

    findCourse(courseName: string): Course | undefined {
        return this.courses.find(
            course => course.name.toLowerCase() === courseName.toLowerCase()
        );
    }

    getCourses(): Course[] {
        return this.courses;
    }
}

const courseManager = new CourseManager();

const webDesign = new OnlineCourse("Web Design", 40);
const typescript = new OnlineCourse("TypeScript", 30);
const graphicDesign = new OnlineCourse("Graphic Design", 25);

courseManager.addCourse(webDesign);
courseManager.addCourse(typescript);
courseManager.addCourse(graphicDesign);

webDesign.registerStudent("Diana");
webDesign.registerStudent("Anna");
webDesign.registerStudent("Diana");

typescript.registerStudent("Diana");
typescript.registerStudent("Alex");

graphicDesign.registerStudent("Maria");
graphicDesign.registerStudent("Sophia");

console.log("\nCourses:");

for (const course of courseManager.getCourses()) {
    console.log(`\nCourse: ${course.name}`);
    console.log(`Duration: ${course.duration} hours`);
    console.log(
        `Students: ${course.students.length > 0 ? course.students.join(", ") : "No students"}`
    );
}

const foundCourse = courseManager.findCourse("TypeScript");

if (foundCourse) {
    console.log(`\nFound course: ${foundCourse.name}`);
    console.log(`Students: ${foundCourse.students.join(", ")}`);
}