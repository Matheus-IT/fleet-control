import React, { useState } from "react";
import {
  approveEntryRequest,
  doNotApproveEntryRequest,
} from "@/api/request-queries";
import { VehicleEntryRegistryDetail, VehicleEntryStatus } from "@/types/api";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { formatDate, formatTime } from "../../utils/date-time";
import { useRouter } from "next/navigation";
import { Clock, Car, Wrench, AlertTriangle, User, Users } from "lucide-react";
import { useUserInfoStore } from "@/stores/user-info";
import { formatCurrency } from "@/utils/currency";
import { calculateTotal } from "@/utils/vehicle-parts";

export default function VehicleDetail({
  lastEntryData,
}: {
  lastEntryData: VehicleEntryRegistryDetail;
}) {
  const { userInfo } = useUserInfoStore((state) => state);

  const vehicle = lastEntryData.vehicle;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observation, setObservation] = useState("");

  const mutation = useMutation({
    mutationFn: () => approveEntryRequest(lastEntryData!.id, userInfo!.id),
    onSettled: () => {
      window.location.reload();
    },
  });

  const doNotApproveMutation = useMutation({
    mutationFn: () =>
      doNotApproveEntryRequest(lastEntryData!.id, observation, userInfo!.id),
    onSettled: () => {
      setIsModalOpen(false);
      setObservation("");
      window.location.reload();
    },
  });

  function handleGoToHistory() {
    router.push(`/vehicle-history/${vehicle.slug}`);
  }

  function handleApprove() {
    mutation.mutate();
  }

  function handleDoNotApprove() {
    const thereIsObservation = observation.trim();
    if (thereIsObservation) {
      doNotApproveMutation.mutate();
    }
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <Car className="w-6 h-6" />
          <div className="flex flex-col">
            <p className="text-xl font-bold">{vehicle.model}</p>
            <p className="text-small text-default-500">
              Placa: {vehicle.licence_plate}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-gray-500" />
              <span className="text-base">
                <span className="text-gray-600">Na oficina:</span>{" "}
                <strong
                  className={
                    vehicle.is_at_workshop
                      ? "text-green-700 bg-green-100 px-2 py-1 rounded"
                      : "text-red-600 bg-red-100 px-2 py-1 rounded"
                  }
                >
                  {vehicle.is_at_workshop ? "Sim" : "Não"}
                </strong>
              </span>
            </p>

            {!vehicle.is_at_workshop && (
              <p className="ml-6 text-xl">
                <strong>Informações da última atualização:</strong>
              </p>
            )}

            <p className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Solicitante:</span>{" "}
              <strong>{lastEntryData.author!.name}</strong>
            </p>

            <p className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Equipe responsável:</span>{" "}
              <strong>
                {lastEntryData.responsable_team!.name} -{" "}
                {lastEntryData.responsable_team!.type}
              </strong>
            </p>

            <div className="mt-2 pl-6">
              <p className="text-base">
                <span className="text-gray-600">Problema reportado:</span>{" "}
                <strong>{lastEntryData.problem_reported}</strong>
              </p>
              {lastEntryData.workshop && (
                <p className="text-base">
                  <span className="text-gray-600">Oficina:</span>{" "}
                  <strong>{lastEntryData.workshop.name}</strong>
                </p>
              )}
            </div>

            {lastEntryData.parts &&
              lastEntryData.parts.length > 0 &&
              vehicle.is_at_workshop && (
                <div className="ml-5 p-2 border border-gray-300 rounded-lg">
                  <span className="text-gray-600 font-medium">Peças:</span>
                  <div className="mt-2 space-y-3">
                    {lastEntryData.parts.map((part, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Peça:</span>{" "}
                            <strong>{part.name}</strong>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantidade:</span>{" "}
                            <strong>{part.quantity}</strong>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Valor unitário:
                            </span>{" "}
                            <strong>{formatCurrency(part.unit_value)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 text-right font-medium">
                      Valor total:{" "}
                      {formatCurrency(calculateTotal(lastEntryData.parts))}
                    </div>
                  </div>
                </div>
              )}

            {lastEntryData.parts && lastEntryData.parts.length == 0 && (
              <div className="space-y-2 pl-7">
                <p className="text-base text-gray-600">
                  Não há peças nessa entrada...
                </p>
              </div>
            )}

            <div className="space-y-2 ml-6">
              <div className="text-base">
                <span className="text-gray-600">Status:</span>{" "}
                {lastEntryData.status == VehicleEntryStatus.NOT_APPROVED && (
                  <>
                    <span className="text-danger-600">
                      <strong>Não aprovado</strong>
                    </span>
                    <br />
                    <span className="text-gray-600">Motivo: </span>
                    <Textarea readOnly value={lastEntryData.observation} />
                  </>
                )}
                {lastEntryData.status ==
                  VehicleEntryStatus.WAITING_APPROVAL && (
                  <span className="text-orange-600">
                    <strong>Aguardando aprovação</strong>
                  </span>
                )}
                {lastEntryData.status == VehicleEntryStatus.APPROVED && (
                  <span className="text-success-600">
                    <strong>Aprovado</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              {lastEntryData.author ? (
                <span>
                  Ultima atualização em{" "}
                  <strong>{formatDate(lastEntryData.created_at)}</strong> às{" "}
                  {formatTime(lastEntryData.created_at)} por{" "}
                  <strong>{lastEntryData.author.name}</strong>
                </span>
              ) : (
                <span>
                  Registro do veículo criado em{" "}
                  <strong>{formatDate(lastEntryData.created_at)}</strong> às{" "}
                  {formatTime(lastEntryData.created_at)}
                </span>
              )}
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between">
          <Button color="primary" onPress={handleGoToHistory}>
            Ver histórico
          </Button>

          {!vehicle.can_enter_workshop && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <Button
                color="success"
                onPress={handleApprove}
                isDisabled={
                  lastEntryData.status == VehicleEntryStatus.NOT_APPROVED
                }
              >
                Aprovar
              </Button>
              <Button
                color="danger"
                onPress={() => setIsModalOpen(true)}
                isDisabled={
                  lastEntryData.status == VehicleEntryStatus.NOT_APPROVED
                }
              >
                Rejeitar
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Rejeitar entrada</ModalHeader>
          <ModalBody>
            <Textarea
              label="Observação"
              placeholder="Digite o motivo da não aprovação"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleDoNotApprove}
              isDisabled={!observation.trim()}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
