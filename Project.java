import java.util.Scanner;
import java.util.InputMismatchException;

interface ParkingLot {
    void parkCar();
    void removeCar();
    void viewParkedCars();
}

class ParkingSystem implements ParkingLot {
    private int totalSlots;
    private int availableSlots;
    private String[] parkedCars;
    private Scanner scanner;

    public ParkingSystem(int totalSlots) {
        this.totalSlots = totalSlots;
        this.availableSlots = totalSlots;
        this.parkedCars = new String[totalSlots];
        this.scanner = new Scanner(System.in);
    }

    @Override
    public void parkCar() {
        if (availableSlots == 0) {
            System.out.println("Sorry, there are no available parking slots.");
            return;
        }
        System.out.println("Enter the license plate number of the car:");
        String licensePlate = scanner.nextLine();

        for (int i = 0; i < totalSlots; i++) {
            if (parkedCars[i] == null) {
                parkedCars[i] = licensePlate;
                availableSlots--;
                System.out.println("Car parked successfully. Available slots: " + availableSlots);
                return;
            }
        }
    }

    @Override
    public void removeCar() {
        if (availableSlots == totalSlots) {
            System.out.println("There are no parked cars.");
            return;
        }
        System.out.println("Enter the license plate number of the car to be removed:");
        String licensePlate = scanner.nextLine();

        for (int i = 0; i < totalSlots; i++) {
            if (parkedCars[i] != null && parkedCars[i].equals(licensePlate)) {
                parkedCars[i] = null;
                availableSlots++;
                System.out.println("Car removed successfully. Available slots: " + availableSlots);
                return;
            }
        }
        System.out.println("The car is not parked here.");
    }

    @Override
    public void viewParkedCars() {
        if (availableSlots == totalSlots) {
            System.out.println("There are no parked cars.");
            return;
        }
        System.out.println("Parked cars:");
        for (String licensePlate : parkedCars) {
            if (licensePlate != null) {
                System.out.println(licensePlate);
            }
        }
    }

    public void start() {
        while (true) {
            try {
                System.out.println("\nWhat would you like to do?");
                System.out.println("1. Park a car");
                System.out.println("2. Remove a car");
                System.out.println("3. View parked cars");
                System.out.println("4. Exit");
                int choice = scanner.nextInt();
                scanner.nextLine();

                switch (choice) {
                    case 1:
                        parkCar();
                        break;
                    case 2:
                        removeCar();
                        break;
                    case 3:
                        viewParkedCars();
                        break;
                    case 4:
                        System.out.println("Exiting system. Goodbye!");
                        return;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                }
            } catch (InputMismatchException e) {
                System.out.println("Invalid input. Please enter a valid number.");
                scanner.nextLine();
            } catch (Exception e) {
                System.out.println("An error occurred: " + e.getMessage());
                scanner.nextLine();
            }
        }
    }

    public void closeScanner() {
        if (scanner != null) {
            scanner.close();
        }
    }
}

public class Project {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the total number of parking slots:");
        int totalSlots = 0;
        while (true) {
            try {
                totalSlots = scanner.nextInt();
                scanner.nextLine();
                if (totalSlots <= 0) {
                    throw new IllegalArgumentException("Number of slots must be greater than zero.");
                }
                break;
            } catch (InputMismatchException e) {
                System.out.println("Invalid input. Please enter a valid number.");
                scanner.nextLine();
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        ParkingSystem system = new ParkingSystem(totalSlots);
        system.start();
        system.closeScanner();
        scanner.close();
    }
}
