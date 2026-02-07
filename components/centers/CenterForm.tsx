import React, { useState, useEffect, useRef } from "react";
import { Center, CenterFormData, ScheduleItem } from "../../types/center.types";
import { Branch } from "../../types/branch.types";
import { Staff } from "../../types/staff.types";
import { branchService } from "../../services/branch.service";
import { centerService } from "../../services/center.service";
import { authService } from "../../services/auth.service";
import { API_BASE_URL, getHeaders } from "../../services/api.config";
import { X, Plus, Trash2, Loader2, Info } from "lucide-react";
import { colors } from "../../themes/colors";

interface CenterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CenterFormData) => void;
  initialData?: Center | CenterFormData | null;
}

export function CenterForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CenterFormProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form State
  const [centerName, setCenterName] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [centerNameDuplicateError, setCenterNameDuplicateError] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const duplicateCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load user role
  useEffect(() => {
    const storedRolesStr = localStorage.getItem("roles");
    if (storedRolesStr) {
      try {
        const userRoles = JSON.parse(storedRolesStr);
        if (Array.isArray(userRoles) && userRoles.length > 0) {
          const roles = userRoles.map((r: any) => r.name);
          if (roles.includes("field_officer")) {
            setCurrentUserRole("field_officer");
          } else if (roles.includes("super_admin")) {
            setCurrentUserRole("super_admin");
          } else if (roles.includes("admin")) {
            setCurrentUserRole("admin");
          } else {
            setCurrentUserRole(roles[0]);
          }
        }
      } catch (e) {
        console.error("Error parsing roles", e);
      }
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
  }, []);

  // Load form data only when opened and wait for it
  useEffect(() => {
    // Load user role from localStorage
    const storedRolesStr = localStorage.getItem("roles");
    if (storedRolesStr) {
      try {
        const userRoles = JSON.parse(storedRolesStr);
        if (Array.isArray(userRoles) && userRoles.length > 0) {
          // Just take the first one or prioritize field_officer for this logic
          const roles = userRoles.map((r) => r.name);
          if (roles.includes("field_officer")) {
            setCurrentUserRole("field_officer");
          } else if (roles.includes("super_admin")) {
            setCurrentUserRole("super_admin");
          } else if (roles.includes("admin")) {
            setCurrentUserRole("admin");
          } else {
            setCurrentUserRole(roles[0]);
          }
        }
      } catch (e) {
        console.error("Error parsing roles", e);
      }
    }

    const loadFormData = async () => {
      if (!isOpen) return;

      const storedRolesStr = localStorage.getItem("roles");
      let roles: string[] = [];
      if (storedRolesStr) {
        try {
          const userRoles = JSON.parse(storedRolesStr);
          roles = userRoles.map((r: any) => r.name);
        } catch (e) {
          console.error("Error parsing roles", e);
        }
      }

      setIsLoadingData(true);
      try {
        // Fetch branches, field officers, and loan products in parallel
        const [branchesData, fieldOfficersResponse, productsResponse] = await Promise.all([
          branchService.getBranchesAll(),
          fetch(`${API_BASE_URL}/staffs/by-role/field_officer`, {
            headers: getHeaders(),
          }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/loan-products`, {
            headers: getHeaders(),
          }).then((res) => res.json()),
        ]);

        if (productsResponse?.data) {
          setLoanProducts(productsResponse.data);

          // Automatically select 'MF' product if it exists and no product is selected
          const mfProduct = productsResponse.data.find((p: any) => p.product_code === 'MF');
          if (mfProduct && !productId && !initialData) {
            setProductId(String(mfProduct.id));
          }
        }

        let filteredBranches = branchesData || [];

        // If field officer, filter by their assigned branch
        if (roles.includes("field_officer")) {
          const userStr = localStorage.getItem("user");
          const user = userStr ? JSON.parse(userStr) : null;
          const userName = user?.user_name;

          if (userName) {
            try {
              const staffResponse = await fetch(
                `${API_BASE_URL}/staffs/${userName}`,
                {
                  headers: getHeaders(),
                }
              ).then((res) => res.json());

              const staffData = staffResponse.data;
              if (staffData && staffData.branch_id) {
                // Use loose comparison to handle potential string/number mismatches
                filteredBranches = filteredBranches.filter(
                  (b: any) => String(b.id) === String(staffData.branch_id)
                );
              }
            } catch (err) {
              console.error(
                "Failed to fetch staff details for branch filtering",
                err
              );
            }
          }
        }

        setBranches(filteredBranches);

        // Handle varied API response structures for field officers
        if (fieldOfficersResponse?.data) {
          setStaffList(fieldOfficersResponse.data);
        } else if (Array.isArray(fieldOfficersResponse)) {
          setStaffList(fieldOfficersResponse);
        }
      } catch (error) {
        console.error("Failed to load form data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFormData();
  }, [isOpen]);

  // Handle initial data for schedules
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSchedules(initialData.open_days || []);
        setCenterName(initialData.center_name || "");
        setBranchId(String(initialData.branch_id || ""));
        setProductId(String(initialData.product_id || ""));
      } else {
        setSchedules([]);
        setCenterName("");
        setBranchId(branches.length === 1 ? String(branches[0].id) : "");
        setProductId("");
      }
      // Reset errors when modal opens/closes
      setCenterNameDuplicateError(null);
    }
  }, [isOpen, initialData, branches]);

  // Handle auto-selecting 'MF' product for new centers
  useEffect(() => {
    if (isOpen && !initialData && loanProducts.length > 0 && !productId) {
      const mfProduct = loanProducts.find((p: any) => p.product_code === 'MF');
      if (mfProduct) {
        setProductId(String(mfProduct.id));
      }
    }
  }, [isOpen, initialData, loanProducts, productId]);

  const handleAddSchedule = () => {
    // Default to today's date for new schedules
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    setSchedules([...schedules, { day: "", date: todayStr, time: "10:00" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  // Debounced function to check for duplicate center name
  const checkDuplicateCenterName = async (name: string, branch: string) => {
    if (!name.trim() || !branch) {
      setCenterNameDuplicateError(null);
      return;
    }

    // Clear existing timeout
    if (duplicateCheckTimeoutRef.current) {
      clearTimeout(duplicateCheckTimeoutRef.current);
    }

    // Set new timeout for debouncing (500ms)
    duplicateCheckTimeoutRef.current = setTimeout(async () => {
      try {
        setIsCheckingDuplicate(true);
        const result = await centerService.checkDuplicate(
          name.trim(),
          branch,
          initialData && 'id' in initialData ? String(initialData.id) : undefined
        );

        if (result.exists) {
          setCenterNameDuplicateError(
            "A center with this name already exists in this branch. Center names must be unique within a branch."
          );
        } else {
          setCenterNameDuplicateError(null);
        }
      } catch (error) {
        console.error("Error checking duplicate:", error);
        // Don't show error on API failure, just clear any existing error
        setCenterNameDuplicateError(null);
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 500);
  };

  // Handle center name change
  const handleCenterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCenterName(newName);
    if (branchId) {
      checkDuplicateCenterName(newName, branchId);
    }
  };

  // Handle branch change
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranchId = e.target.value;
    setBranchId(newBranchId);
    if (centerName.trim()) {
      checkDuplicateCenterName(centerName, newBranchId);
    }
  };

  // Handle field officer change to auto-fetch branch
  const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStaffId = e.target.value;
    const selectedStaff = staffList.find(s => String(s.staff_id) === String(selectedStaffId));

    if (selectedStaff && selectedStaff.branch_id) {
      const newBranchId = String(selectedStaff.branch_id);
      setBranchId(newBranchId);
      if (centerName.trim()) {
        checkDuplicateCenterName(centerName, newBranchId);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (duplicateCheckTimeoutRef.current) {
        clearTimeout(duplicateCheckTimeoutRef.current);
      }
    };
  }, []);

  // ... (existing code for role loading)

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    const newSchedules = [...schedules];

    if (field === "date") {
      // When date changes, automatically update the day name
      const dateObj = new Date(value);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      newSchedules[index] = {
        ...newSchedules[index],
        [field]: value,
        day: dayName,
      };
    } else {
      newSchedules[index] = { ...newSchedules[index], [field]: value };
    }

    // Immediate validation for duplicate day+time combinations
    const seen = new Set();
    let hasDuplicate = false;

    // Check for duplicates
    for (const s of newSchedules) {
      // Only check if both day and time are present to avoid false positives on empty new rows
      if (s.day && s.time) {
        const key = `${s.day}-${s.time}`;
        if (seen.has(key)) {
          hasDuplicate = true;
          break;
        }
        seen.add(key);
      }
    }

    if (hasDuplicate) {
      setDuplicateError(
        "Duplicate schedule entries (same day and time) are not allowed."
      );
    } else {
      setDuplicateError(null);
    }

    setSchedules(newSchedules);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if there are duplicate errors
    if (duplicateError || centerNameDuplicateError) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data: CenterFormData = {
      CSU_id: formData.get("CSU_id") as string,
      center_name: formData.get("center_name") as string,
      branch_id: branchId,
      product_id: formData.get("product_id") as string,
      staff_id:
        currentUserRole === "field_officer"
          ? currentUser?.user_name || null
          : (formData.get("contactPerson") as string) || null,
      address: formData.get("address") as string,
      location: formData.get("locationType") as string,
      status: !initialData
        ? currentUserRole === "field_officer"
          ? "inactive"
          : "active"
        : (initialData.status as "active" | "inactive" | "rejected"),
      open_days: schedules,
      meetingTime: schedules.length > 0 ? schedules[0].time : undefined,
    };

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border-default">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border-divider flex items-center justify-between z-10 transition-colors">
          <h2 className="text-xl font-bold text-text-primary">
            {initialData ? "Edit Center" : "Create New Center"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-hover rounded-full transition-colors text-text-muted"
          >
            <X size={24} />
          </button>
        </div>

        {isLoadingData ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="animate-spin" style={{ color: colors.primary[600] }} />
            <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading form details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CSU ID Hidden or Commented as per user's manual edit */}
              {/* 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CSU ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CSU_id"
                                    required
                                    defaultValue={initialData?.CSU_id}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g. C001"
                                />
                            </div> 
                            */}

              <div>
                <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="center_name"
                  required
                  value={centerName}
                  onChange={handleCenterNameChange}
                  className={`w-full px-4 py-2.5 bg-input border rounded-xl focus:ring-2 transition-all text-text-primary ${centerNameDuplicateError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border-input focus:ring-primary-500/20"
                    }`}
                  style={!centerNameDuplicateError ? { '--tw-ring-color': colors.primary[500] } as any : {}}
                  placeholder="Enter center name"
                />
                {centerNameDuplicateError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <Info size={14} />
                    {centerNameDuplicateError}
                  </p>
                )}
                {isCheckingDuplicate && !centerNameDuplicateError && (
                  <p className="mt-1 text-xs text-gray-500">
                    Checking availability...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  name="branch_id"
                  required
                  value={branchId}
                  onChange={handleBranchChange}
                  disabled={!!initialData}
                  className={`w-full px-4 py-2.5 bg-input border border-border-input rounded-xl focus:ring-2 transition-all text-text-primary outline-none ${!!initialData ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' : ''}`}
                  style={{ '--tw-ring-color': colors.primary[500] } as any}
                >
                  {branches.length !== 1 && !initialData && (
                    <option value="">Select Branch</option>
                  )}
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
                {initialData && (
                  <p className="mt-1 text-[10px] text-text-muted italic flex items-center gap-1">
                    <Info size={10} />
                    Branch cannot be modified for existing centers.
                  </p>
                )}
              </div>

              {/* Loan Product - Hidden and defaulted to 'MF' as per user request */}
              <input type="hidden" name="product_id" value={productId} />

              <div>
                <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="locationType"
                  required
                  defaultValue={initialData?.location}
                  className="w-full px-4 py-2.5 bg-input border border-border-input rounded-xl focus:ring-2 transition-all text-text-primary outline-none"
                  style={{ '--tw-ring-color': colors.primary[500] } as any}
                  placeholder="e.g. Urban, Rural"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                required
                defaultValue={initialData?.address}
                rows={2}
                className="w-full px-4 py-2.5 bg-input border border-border-input rounded-xl focus:ring-2 transition-all text-text-primary outline-none resize-none"
                style={{ '--tw-ring-color': colors.primary[500] } as any}
                placeholder="Full address of the center"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUserRole === "field_officer" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-black text-text-muted uppercase tracking-widest">
                    Assigned Field Officer
                  </label>
                  <div className="px-4 py-2.5 bg-input border border-border-divider rounded-xl text-sm font-bold text-text-secondary flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary[600] }} />
                    {currentUser?.full_name ||
                      currentUser?.name ||
                      "Loading..."}
                    <span className="text-[10px] text-text-muted font-mono bg-card px-1.5 py-0.5 rounded border border-border-divider">
                      {currentUser?.user_name || "..."}
                    </span>
                  </div>
                  <input
                    type="hidden"
                    name="contactPerson"
                    value={currentUser?.user_name || ""}
                  />
                  <p className="text-[10px] italic" style={{ color: colors.primary[600] }}>
                    Self-assigned as creating officer.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">
                    Field Officer <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="contactPerson"
                    defaultValue={initialData?.staff_id || ""}
                    onChange={handleStaffChange}
                    className="w-full px-4 py-2.5 bg-input border border-border-input rounded-xl focus:ring-2 transition-all text-text-primary outline-none"
                    style={{ '--tw-ring-color': colors.primary[500] } as any}
                    required
                  >
                    <option value="">Select Officer</option>
                    {staffList.map((staff) => (
                      <option key={staff.staff_id} value={staff.staff_id}>
                        {staff.full_name} ({staff.staff_id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {initialData && currentUserRole !== "field_officer" ? (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-tighter">
                    <Info size={14} />
                    Center Status
                  </div>
                  <p className="text-[10px] text-blue-600 mt-1">
                    Status management is now handled via the action buttons in
                    the center table.
                  </p>
                </div>
              ) : !initialData && currentUserRole === "field_officer" ? (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-tighter">
                    <Info size={14} />
                    Approval Required
                  </div>
                  <p className="text-[10px] text-amber-600 mt-1">
                    This center will be saved as{" "}
                    <span className="font-bold">Pending</span> and requires
                    manager activation.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="bg-table-header p-4 rounded-xl border border-border-divider">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-black text-text-muted uppercase tracking-widest">
                  Meeting Schedules
                </label>
                {authService.hasPermission("centers.schedule") && (
                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-500/20 bg-primary-500/10 transition-all hover:bg-primary-500/20"
                    style={{ color: colors.primary[600] }}
                  >
                    <Plus size={14} /> Add Schedule
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {schedules.map((schedule, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-in fade-in slide-in-from-top-1 duration-200 bg-card p-3 rounded-xl border border-border-divider"
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-[9px] uppercase font-black text-text-muted mb-1.5 tracking-widest">
                        Day
                      </label>
                      {!authService.hasPermission("centers.schedule") ? (
                        <input
                          type="text"
                          value={schedule.day}
                          readOnly
                          className="w-full px-4 py-2 bg-input border border-border-divider rounded-lg text-text-muted outline-none font-bold cursor-default"
                        />
                      ) : (
                        <select
                          value={schedule.day}
                          onChange={(e) =>
                            handleScheduleChange(idx, "day", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          required
                        >
                          <option value="">Select Day</option>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="w-full sm:w-32">
                      <label className="block text-[9px] uppercase font-black text-text-muted mb-1.5 tracking-widest">
                        Time
                      </label>
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) =>
                          handleScheduleChange(idx, "time", e.target.value)
                        }
                        readOnly={!authService.hasPermission("centers.schedule")}
                        className={`w-full px-4 py-2 bg-input border border-border-input rounded-lg focus:ring-2 transition-all text-text-primary outline-none ${!authService.hasPermission("centers.schedule")
                          ? "opacity-50 cursor-default"
                          : ""
                          }`}
                        style={{ '--tw-ring-color': colors.primary[500] } as any}
                      />
                    </div>

                    {authService.hasPermission("centers.schedule") && (
                      <div className="pt-5 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveSchedule(idx)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove schedule"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {(schedules.length === 0 ||
                  currentUserRole === "field_officer") && (
                    <div className="text-center py-4 text-gray-500 text-sm italic bg-white rounded border border-dashed border-gray-300">
                      {currentUserRole === "field_officer"
                        ? "Meeting schedules are managed exclusively by Managers."
                        : "No meeting schedules configured"}
                    </div>
                  )}
                {duplicateError && (
                  <div className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1">
                    <Info size={12} />
                    {duplicateError}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-card pt-4 border-t border-border-divider flex gap-3 justify-end transition-colors pb-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border-input rounded-xl text-text-secondary font-bold hover:bg-hover text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!!centerNameDuplicateError || isCheckingDuplicate}
                className={`px-6 py-2 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2 ${centerNameDuplicateError || isCheckingDuplicate
                  ? "bg-muted text-text-muted cursor-not-allowed"
                  : "text-white hover:opacity-90"
                  }`}
                style={!(centerNameDuplicateError || isCheckingDuplicate) ? { backgroundColor: colors.primary[600] } : {}}
              >
                {initialData
                  ? initialData.status === "rejected"
                    ? "Resubmit Request"
                    : "Update Center"
                  : "Create Center"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
