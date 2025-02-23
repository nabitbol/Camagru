class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor(array) {
        this.head = null;
        this.length = 0;

        if (Array.isArray(array) && array.length > 0) {
            this.head = new Node(array[0]);
            let current = this.head;
            this.length = 1;

            for (let i = 1; i < array.length; i++) {
                current.next = new Node(array[i]);
                current = current.next;
                this.length++;
            }
        }
    }
}

export { LinkedList };
