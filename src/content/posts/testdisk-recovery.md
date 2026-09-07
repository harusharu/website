---
title: "How to Recover Lost Partitions on Debian-based Systems Using TestDisk"
description: "Step-by-step guide to recover lost partitions on Debian, Ubuntu, Linux Mint, and other Debian-based systems with TestDisk."
date: "2026-02-20"
---

Accidentally formatted a disk or deleted a partition table?
On traditional hard drives (HDDs), this doesn’t always mean the data is gone forever. In many cases, the filesystem and files are still there - only the partition metadata has been damaged or erased.

In this guide, we’ll walk through **how to recover lost partitions using TestDisk** on Debian-based distributions (Debian, Ubuntu, Linux Mint, Pop!\_OS, etc.).

> ⚠️ **Important:** The more you use the affected disk after the mistake, the higher the chance your data will be overwritten. **Stop all writes to that disk immediately.** Do not create new partitions, do not format again, and do not copy new data to it.

---

## 1. What is TestDisk?

[TestDisk](https://www.cgsecurity.org/) is a powerful open-source data recovery tool. It can:

- Detect and rebuild lost partition tables
- Recover deleted partitions
- Repair boot sectors
- List and copy files from damaged or lost partitions

In many "I formatted the wrong disk" situations, TestDisk can restore the original partition so the system can mount it again as before.

---

## 2. Prerequisites

- A Debian-based Linux system (Debian, Ubuntu, etc.)
- The affected disk **must be accessible**, e.g. `/dev/sda`, `/dev/sdb`, etc.
- You should have **sudo** privileges.
- Ideally: another disk with enough free space to copy recovered files (as a backup option).

---

## 3. Identify the Correct Disk

Before doing anything with TestDisk, confirm which disk you need to work on.

Open a terminal and run:

```bash
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
```

Identify your target drive:

- System disk is often `/dev/sda`
- External/secondary disks may appear as `/dev/sdb`, `/dev/sdc`, etc.

Example:

```text
NAME   SIZE TYPE MOUNTPOINT
sda   931G disk
├─sda1 512M part /boot
├─sda2 100G part /
└─sda3 830G part /home
sdb   931G disk
```

If you accidentally formatted or removed partitions on the **1TB HDD** that used to hold data, and it now shows as a single unpartitioned disk, that might be something like `/dev/sdb`.

> ✅ **Double-check the disk name.** Using the wrong disk can destroy data on a healthy drive.

---

## 4. Install TestDisk

On Debian-based systems, TestDisk is available directly from the repositories.

```bash
sudo apt update
sudo apt install testdisk
```

---

## 5. Start TestDisk

Run TestDisk with root privileges:

```bash
sudo testdisk
```

You’ll see a text-based interface in the terminal.

1. At the first screen (**[ Create / Append / No log ]**), you can safely choose **`[ Create ]`** to start a new log file, or **`[ No Log ]`** if you prefer.
2. Press **Enter**.

---

## 6. Select the Disk

Next, TestDisk will list available disks, for example:

```text
Disk /dev/sda - 1000 GB / 931 GiB
Disk /dev/sdb -  500 GB / 465 GiB
```

Use the **Up/Down arrow keys** to select the disk that contains the lost partition
(e.g. `/dev/sda` or `/dev/sdb`).

Press **Enter** to continue.

> ⚠️ Make sure you select the **disk** (`/dev/sdX`), not a partition (`/dev/sdX1` etc.).

---

## 7. Select Partition Table Type

TestDisk usually detects the partition table type automatically.

Common values:

- **Intel/PC partition** - for MBR / classic BIOS systems
- **EFI GPT** - for modern UEFI systems using GPT

Most of the time you can accept the default selection and press **Enter**.

---

## 8. Analyse the Disk

On the next menu, choose:

```text
[ Analyse ]  Analyse current partition structure and search for lost partitions
```

Press **Enter**.

TestDisk will show the current partition structure. If you accidentally wiped the partition table or reformatted, you may see either:

- An empty partition table, or
- A new partition covering the drive (e.g. new FAT32/NTFS/ext4 partition).

At the bottom, choose:

```text
[ Quick Search ]
```

Press **Enter** to begin scanning for lost partitions.

---

## 9. Review Found Partitions

After the Quick Search completes, TestDisk will list any detected partitions.

A common example for a single recovered partition:

```text
Disk /dev/sda - 1000 GB / 931 GiB

Partition     Start        End    Size in sectors
P MS Data        2048 1953525136   1953523089  [NO NAME]
```

Here:

- `P` = Primary partition
- `MS Data` = generic label for NTFS/exFAT/FAT32 partitions
- The size is close to the full capacity of the disk.

You can use **Up/Down arrows** to select a partition.

---

## 10. Verify Files Inside the Found Partition

Before writing anything to disk, verify that TestDisk can actually see your files.

With the desired partition highlighted:

1. Press **`P`** (uppercase P) to **list files**.

If recovery is possible, you should now see a familiar directory structure: folders, filenames, etc.

At this point you have two options:

- **Option A: Copy important files out immediately**
  You can use TestDisk’s file browser to copy files to another disk.
- **Option B: Restore the partition table**
  You let TestDisk rewrite the partition entry so the OS can mount the partition normally again.

For many users, restoring the partition table is the most convenient solution.

To go back from the file listing view, press **`q`**.

---

## 11. Set Partition Type and Write the New Table

Back on the partition list:

- Ensure the partition is marked with `P` for **Primary** (this is usually correct by default).
- If you have multiple partitions, you may need to mark others as:
  - `P` - Primary
  - `L` - Logical
  - `*` - Bootable (if it’s a boot partition)

Use the **Left/Right arrow keys** to change the type if needed.

When everything looks correct:

1. Press **Enter** to continue.
2. Choose **`[ Write ]`** to write the new partition table to disk.
3. Confirm when TestDisk asks "Write partition table? (Y/N)".

You should see a message that the partition table has been written successfully.

TestDisk will then usually ask you to **reboot** the system.

---

## 12. Reboot and Check the Restored Partition

Reboot your machine:

```bash
sudo reboot
```

After the system comes back up, check the disks again:

```bash
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT
```

You should now see the restored partition with its filesystem detected, for example:

```text
sdb   931G disk
└─sdb1 931G part ntfs
```

You can then mount it:

```bash
sudo mkdir -p /mnt/recovered
sudo mount /dev/sdb1 /mnt/recovered
```

Browse `/mnt/recovered` and confirm that your files are back.

---

## 13. If Quick Search Didn’t Find the Right Partition

If the Quick Search result doesn’t show your old partition, or file listing is empty/garbled, you can try a **Deeper Search**:

1. From the **Analyse** menu, after Quick Search, choose:

   ```text
   [ Deeper Search ]
   ```

2. This takes longer but can find partitions that Quick Search missed.

Again, review any found partitions, use `P` to list files, and if they look correct, proceed to write the partition table as in the previous steps.

---

## 14. Optional: Work on a Clone (Advanced but Safer)

If the drive is old, making strange noises, or has read errors, it’s safer to clone it first and run TestDisk on the clone.

You can use `ddrescue` for this:

```bash
sudo apt install gddrescue
sudo ddrescue /dev/sdX /path/to/image.img /path/to/logfile.log
```

Replace `/dev/sdX` with your real device (e.g. `/dev/sdb`), and point the image and log to another healthy drive with enough space.

Then run TestDisk on the image:

```bash
sudo testdisk /path/to/image.img
```

---

## 15. When TestDisk Isn’t Enough

TestDisk is extremely powerful, but there are situations where recovery is limited:

- The disk has been **heavily overwritten** after formatting.
- There is **physical damage** (clicking sounds, failing sectors across the platters).
- Multiple repartitions and reformats were performed after the original data was lost.

In these cases, you may still be able to recover individual files using tools like PhotoRec (from the same developers as TestDisk), or you may need to consider professional data recovery services.

---

## Conclusion

On Debian-based systems, recovering a lost partition is often very achievable using TestDisk, especially when:

- The disk was only quick-formatted
- The partition table was deleted but not heavily overwritten
- You stopped using the drive immediately after the mistake

The key steps are:

1. Identify the correct disk (`lsblk`)
2. Install and run TestDisk
3. Analyse the disk and search for lost partitions
4. Verify files with `P` (list files)
5. Write the recovered partition table and reboot

Handled carefully, this process can bring an "empty" drive back to life with its original data intact.
