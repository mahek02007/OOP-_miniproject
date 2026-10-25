
#include <iostream>
#include <vector>
#include <string>
#include <limits>
using namespace std;

class Patient {
private:
    int id, age;
    string name, disease;

public:
    Patient(int i, string n, int a, string d)
        : id(i), name(n), age(a), disease(d) {}

    int getId() const { return id; }

    void display() const {
        cout << "Patient ID: " << id
             << "\nName: " << name
             << "\nAge: " << age
             << "\nCondition: " << disease << "\n";
    }
};

class Doctor {
private:
    int id;
    string name, specialization;

public:
    Doctor(int i, string n, string s)
        : id(i), name(n), specialization(s) {}

    int getId() const { return id; }

    void display() const {
        cout << "Doctor ID: " << id
             << "\nName: " << name
             << "\nSpecialization: " << specialization << "\n";
    }
};

class Appointment {
private:
    int id, patientId, doctorId;
    string date, time;

public:
    Appointment(int i, int p, int d, string dt, string tm)
        : id(i), patientId(p), doctorId(d),
          date(dt), time(tm) {}

    void display() const {
        cout << "Appointment ID: " << id
             << "\nPatient ID: " << patientId
             << "\nDoctor ID: " << doctorId
             << "\nDate: " << date
             << "\nTime: " << time << "\n";
    }
};

class HospitalManagementSystem {
private:
    vector<Patient> patients;
    vector<Doctor> doctors;
    vector<Appointment> appointments;

    int nextPatientId = 1;
    int nextDoctorId = 1;
    int nextAppointmentId = 1;

    bool patientExists(int id) const {
        for (const auto& p : patients)
            if (p.getId() == id) return true;
        return false;
    }

    bool doctorExists(int id) const {
        for (const auto& d : doctors)
            if (d.getId() == id) return true;
        return false;
    }

    void clearInput() {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

public:
    void addPatient() {
        string name, disease;
        int age;

        cout << "Enter patient name: ";
        getline(cin >> ws, name);

        cout << "Enter age: ";
        if (!(cin >> age) || age < 1 || age > 120) {
            cout << "Invalid age.\n";
            clearInput();
            return;
        }

        cout << "Enter condition: ";
        getline(cin >> ws, disease);

        patients.emplace_back(nextPatientId++, name, age, disease);
        cout << "Patient added successfully. ID: "
             << patients.back().getId() << "\n";
    }

    void showPatients() const {
        if (patients.empty()) {
            cout << "No patient records found.\n";
            return;
        }

        for (const auto& p : patients) {
            p.display();
            cout << "--------------------\n";
        }
    }

    void searchPatient() const {
        int id;
        cout << "Enter patient ID: ";

        if (!(cin >> id)) {
            cout << "Invalid ID.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return;
        }

        for (const auto& p : patients) {
            if (p.getId() == id) {
                p.display();
                return;
            }
        }

        cout << "Patient not found.\n";
    }

    void addDoctor() {
        string name, specialization;

        cout << "Enter doctor name: ";
        getline(cin >> ws, name);

        cout << "Enter specialization: ";
        getline(cin >> ws, specialization);

        doctors.emplace_back(nextDoctorId++, name, specialization);
        cout << "Doctor added successfully. ID: "
             << doctors.back().getId() << "\n";
    }

    void showDoctors() const {
        if (doctors.empty()) {
            cout << "No doctor records found.\n";
            return;
        }

        for (const auto& d : doctors) {
            d.display();
            cout << "--------------------\n";
        }
    }

    void bookAppointment() {
        if (patients.empty() || doctors.empty()) {
            cout << "Add a patient and a doctor first.\n";
            return;
        }

        int pId, dId;
        string date, time;

        cout << "Enter patient ID: ";
        if (!(cin >> pId)) {
            cout << "Invalid patient ID.\n";
            clearInput();
            return;
        }

        if (!patientExists(pId)) {
            cout << "Patient ID not found.\n";
            return;
        }

        cout << "Enter doctor ID: ";
        if (!(cin >> dId)) {
            cout << "Invalid doctor ID.\n";
            clearInput();
            return;
        }

        if (!doctorExists(dId)) {
            cout << "Doctor ID not found.\n";
            return;
        }

        cout << "Enter date (DD-MM-YYYY): ";
        cin >> date;

        cout << "Enter time (e.g. 10:30AM): ";
        cin >> time;

        appointments.emplace_back(
            nextAppointmentId++, pId, dId, date, time
        );

        cout << "Appointment booked successfully.\n";
    }

    void showAppointments() const {
        if (appointments.empty()) {
            cout << "No appointments found.\n";
            return;
        }

        for (const auto& a : appointments) {
            a.display();
            cout << "--------------------\n";
        }
    }

    void run() {
        int choice;

        do {
            cout << "\n===== HOSPITAL MANAGEMENT SYSTEM =====\n"
                 << "1. Add Patient\n"
                 << "2. View Patients\n"
                 << "3. Search Patient\n"
                 << "4. Add Doctor\n"
                 << "5. View Doctors\n"
                 << "6. Book Appointment\n"
                 << "7. View Appointments\n"
                 << "0. Exit\n"
                 << "Enter your choice: ";

            if (!(cin >> choice)) {
                cout << "Please enter a valid number.\n";
                clearInput();
                continue;
            }

            switch (choice) {
                case 1: addPatient(); break;
                case 2: showPatients(); break;
                case 3: searchPatient(); break;
                case 4: addDoctor(); break;
                case 5: showDoctors(); break;
                case 6: bookAppointment(); break;
                case 7: showAppointments(); break;
                case 0:
                    cout << "Thank you for using the system.\n";
                    break;
                default:
                    cout << "Invalid choice.\n";
            }
        } while (choice != 0);
    }
};

int main() {
    HospitalManagementSystem system;
    system.run();
    return 0;
}

